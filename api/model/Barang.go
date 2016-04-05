package model

import (
	"fmt"

	"github.com/jinzhu/gorm"
)

type Barang struct {
	NamaBarang string
	Satuan     string
	gorm.Model
}

type Supplier struct {
	NamaSuplier string
	Alamat      string
	gorm.Model
}

func (barang *Barang) GetBarangs() []Barang {
	db := initDb()
	var barangs []Barang

	db.Table("barang").Select("*").Find(&barangs)
	return barangs
}

func (barang *Barang) GetByID(id int) {
	db := initDb()
	db.Where("id = ?", id).Find(&barang)
}

type BarangInput struct {
	NamaBarang string
	Satuan     string
	ID         string `json:"id"`
}

func (input *BarangInput) ValidateInput(action string) (*Barang, APIMessage) {
	result := APIMessage{
		Error:   false,
		Message: fmt.Sprintf("Successfully %s barang", action),
	}
	var barang Barang

	if input.NamaBarang == "" {
		result.Error = true
		result.Message = "Nama barang kosong"
	}

	if input.Satuan == "" {
		result.Error = true
		result.Message = "Satuan barang kosong"
	}

	if result.Error {
		return &barang, result
	}

	barang.NamaBarang = input.NamaBarang
	barang.Satuan = input.Satuan

	return &barang, result
}
