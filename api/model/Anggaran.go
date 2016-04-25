package model

import (
	"fmt"

	"github.com/jinzhu/gorm"
)

type Anggaran struct {
	Lokasi     string
	BlokRumah  string
	Keterangan string
	gorm.Model
}

type AnggaranDetail struct {
	BarangId   uint
	AnggaranId uint
	Jumlah     int
	Harga      int
	gorm.Model
}

func (anggaran *Anggaran) UpdateDetails(id string, items []AnggaranDetail) {
	db := initDb()
	db.Delete(AnggaranDetail{}, "anggaran_id = ?", id)

	for _, anggaran_detail := range items {
		db.Create(&anggaran_detail)
	}
}

func (anggaran *Anggaran) GetDetails(id int) []AnggaranDetail {
	db := initDb()
	var details []AnggaranDetail

	db.Table("anggaran_detail").Select("*").Where("anggaran_id = ?", id).Find(&details)
	return details
}

func (anggaran *Anggaran) GetAnggarans() []Anggaran {
	db := initDb()
	var anggarans []Anggaran

	db.Table("anggaran").Select("*").Find(&anggarans)
	return anggarans
}

func (anggaran *Anggaran) GetByID(id int) {
	db := initDb()
	db.Where("id = ?", id).Find(&anggaran)
}

type AnggaranInput struct {
	Lokasi     string
	BlokRumah  string
	Keterangan string
	Barang     []string
	Jumlah     []string
	ID         string `json:"id"`
}

func (input *AnggaranInput) ValidateInput(action string) (*Anggaran, APIMessage) {
	result := APIMessage{
		Error:   false,
		Message: fmt.Sprintf("Successfully %s anggaran", action),
	}
	var anggaran Anggaran

	if input.Lokasi == "" {
		result.Error = true
		result.Message = "Lokasi kosong"
	}

	if input.BlokRumah == "" {
		result.Error = true
		result.Message = "Blok rumah kosong"
	}

	if input.Keterangan == "" {
		result.Error = true
		result.Message = "Keterangan kosong"
	}

	if result.Error {
		return &anggaran, result
	}

	anggaran.Lokasi = input.Lokasi
	anggaran.BlokRumah = input.BlokRumah
	anggaran.Keterangan = input.Keterangan

	return &anggaran, result
}

type BarangAnggaran struct {
	BarangId   string
	NamaBarang string
	Jumlah     int
}

func (anggaran *Anggaran) GetBarang(anggaranId int) []BarangAnggaran {
	db := initDb()
	var barang []BarangAnggaran
	db.Table("anggaran_detail ad").Select("DISTINCT ad.barang_id, nama_barang, jumlah").Joins("barang b ON b.barangId = ad.barangId").Scan(&barang)
	fmt.Printf("%+v", barang)

	return barang
}
