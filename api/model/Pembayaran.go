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
	SupplierId int
	UserId     int
	Jumlah     int
	Status     int
	Harga      int
	Total      int
	ListOrder  string
	Gambar     string
	gorm.Model
}

func (pembayaran *Pembayaran) SaveOrder(anggaranId int, cetak int, orders []string, supplierID string) {
	var bayars []Pembayaran
	db.Table("project_order").
		Select("max(anggaran_id) anggaran_id, max(cetak) cetak, barang_id, sum(jumlah) jumlah, GROUP_CONCAT(id SEPARATOR ',') list_order, supplier_id, user_id").
		Where("anggaran_id = ? and cetak = ? and supplier_id=? and id in(?)", anggaranId, cetak, supplierID, orders).Group("barang_id").Scan(&bayars)

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
	Gambar      string
}

func (pembayaran *Pembayaran) GetPembayarans(id int) []PembayaranDetail {
	var pembayarans []PembayaranDetail
	db.Table("pembayaran").
		Select("*,gambar, count(barang_id) jenis_barang, GROUP_CONCAT(barang_id SEPARATOR ',') list_barang, GROUP_CONCAT(list_order SEPARATOR ',') list_orders").
		Where("anggaran_id = ?", id).
		Group("anggaran_id, cetak").
		Scan(&pembayarans)

	return pembayarans
}

func (pembayaran *Pembayaran) GetByID(anggaranId int, cetak int) []PembayaranDetail {
	var pembayarans []PembayaranDetail
	db.Table("pembayaran").
		Select("*,gambar, count(barang_id) jenis_barang, GROUP_CONCAT(list_order SEPARATOR ',') list_orders").
		Where("anggaran_id = ? and cetak = ?", anggaranId, cetak).
		Joins("join barang on pembayaran.barang_id = barang.id").
		Group("anggaran_id, cetak, barang_id").
		Scan(&pembayarans)

	return pembayarans
}

func (pembayaran *Pembayaran) GetTotalHarga(anggaranId int) int {
	var pembayarans struct {
		TotalHarga int
	}
	db.Table("pembayaran").
		Select("sum(total) as total_harga").
		Where("anggaran_id = ?", anggaranId).
		Scan(&pembayarans)

	return pembayarans.TotalHarga
}

func (pembayaran *Pembayaran) GetByStatus(anggaranId int, status int) []PembayaranDetail {
	var pembayarans []PembayaranDetail
	db.Table("pembayaran").
		Select("*,gambar, count(barang_id) jenis_barang, GROUP_CONCAT(list_order SEPARATOR ',') list_orders").
		Where("anggaran_id = ? and status = ?", anggaranId, status).
		Joins("join barang on pembayaran.barang_id = barang.id").
		Scan(&pembayarans)

	return pembayarans
}

type PembayaranInput struct {
	Supplier string
	CetakId  string
	Jumlah   string
	Status   string
	Harga    string
	ID       string `json:"id"`
}

func (input *PembayaranInput) ValidateInput(action string) (*Pembayaran, APIMessage) {
	result := APIMessage{
		Error:   false,
		Message: fmt.Sprintf("Successfully %s pembayaran", action),
	}
	var pembayaran Pembayaran

	fmt.Printf("%+v", input)

	if input.ID == "" {
		result.Error = true
		result.Message = "Anggaran tidak ditemukan"
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

	id, _ := strconv.Atoi(input.ID)
	pembayaran.ID = uint(id)
	pembayaran.Jumlah, _ = strconv.Atoi(input.Jumlah)
	pembayaran.SupplierId, _ = strconv.Atoi(input.Supplier)
	pembayaran.Harga, _ = strconv.Atoi(input.Harga)
	pembayaran.Status, _ = strconv.Atoi(input.Status)
	pembayaran.Total = pembayaran.Harga * pembayaran.Jumlah

	return &pembayaran, result
}
