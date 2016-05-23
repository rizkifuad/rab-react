package model

import (
	"fmt"
	"strconv"

	"github.com/jinzhu/gorm"
)

type Pembayaran struct {
	AnggaranId string
	BarangId   uint
	Cetak      int
	Jumlah     int
	Status     int
	Harga      int
	Total      int
	ListOrder  string
	gorm.Model
}

func (pembayaran *Pembayaran) SaveOrder(anggaranId int, cetak int) {
	var bayars []Pembayaran
	db.Table("project_order").
		Select("max(anggaran_id) anggaran_id, max(cetak) cetak, barang_id, sum(jumlah) jumlah, GROUP_CONCAT(id SEPARATOR ',') list_order").
		Where("anggaran_id = ? and cetak = ?", anggaranId, cetak).Group("barang_id").Scan(&bayars)

	fmt.Printf("%+v", bayars)
	for _, b := range bayars {
		db.Create(&b)
	}
}

type PembayaranDetail struct {
	Pembayaran
	JenisBarang int
	ListBarang  string
	ListOrders  string
	NamaBarang  string
	Satuan      string
}

func (pembayaran *Pembayaran) GetPembayarans(id int) []PembayaranDetail {
	var pembayarans []PembayaranDetail
	db.Table("pembayaran").
		Select("*, count(barang_id) jenis_barang, GROUP_CONCAT(barang_id SEPARATOR ',') list_barang, GROUP_CONCAT(list_order SEPARATOR ',') list_orders").
		Where("anggaran_id = ?", id).
		Group("anggaran_id, cetak").
		Scan(&pembayarans)

	return pembayarans
}

func (pembayaran *Pembayaran) GetByID(anggaranId int, cetak int) []PembayaranDetail {
	var pembayarans []PembayaranDetail
	db.Table("pembayaran").
		Select("*, count(barang_id) jenis_barang, GROUP_CONCAT(list_order SEPARATOR ',') list_orders").
		Where("anggaran_id = ? and cetak = ?", anggaranId, cetak).
		Joins("join barang on pembayaran.barang_id = barang.id").
		Group("anggaran_id, cetak, barang_id").
		Scan(&pembayarans)

	return pembayarans
}

type PembayaranInput struct {
	AnggaranId string
	BarangId   string
	CetakId    string
	Jumlah     string
	Status     string
	Harga      string
	ListOrder  string
	ID         string `json:"id"`
}

func (input *PembayaranInput) ValidateInput(action string) (*Pembayaran, APIMessage) {
	result := APIMessage{
		Error:   false,
		Message: fmt.Sprintf("Successfully %s pembayaran", action),
	}
	var pembayaran Pembayaran

	if input.AnggaranId == "" {
		result.Error = true
		result.Message = "Anggaran tidak ditemukan"
	}

	if input.BarangId == "" {
		result.Error = true
		result.Message = "Barang tidak ditemukan"
	}

	if input.Jumlah == "" {
		result.Error = true
		result.Message = "Jumlah tidak boleh kosong"
	}

	if input.Harga == "" {
		result.Error = true
		result.Message = "Harga tidak boleh kosong"
	}

	if result.Error {
		return &pembayaran, result
	}

	barangId, _ := strconv.Atoi(input.BarangId)

	pembayaran.AnggaranId = input.AnggaranId
	pembayaran.Jumlah, _ = strconv.Atoi(input.Jumlah)
	pembayaran.BarangId = uint(barangId)
	pembayaran.Harga, _ = strconv.Atoi(input.Harga)
	pembayaran.Total = pembayaran.Harga * pembayaran.Jumlah

	return &pembayaran, result
}
