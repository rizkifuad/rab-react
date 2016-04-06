package model

import (
	"fmt"

	"github.com/jinzhu/gorm"
)

type Supplier struct {
	NamaSupplier string
	Alamat       string
	gorm.Model
}

func (supplier *Supplier) GetSuppliers() []Supplier {
	db := initDb()
	var suppliers []Supplier

	db.Table("supplier").Select("*").Find(&suppliers)
	return suppliers
}

func (supplier *Supplier) GetByID(id int) {
	db := initDb()
	db.Where("id = ?", id).Find(&supplier)
}

type SupplierInput struct {
	NamaSupplier string
	Alamat       string
	ID           string `json:"id"`
}

func (input *SupplierInput) ValidateInput(action string) (*Supplier, APIMessage) {
	result := APIMessage{
		Error:   false,
		Message: fmt.Sprintf("Successfully %s supplier", action),
	}
	var supplier Supplier

	if input.NamaSupplier == "" {
		result.Error = true
		result.Message = "Nama supplier kosong"
	}

	if input.Alamat == "" {
		result.Error = true
		result.Message = "Alamat supplier kosong"
	}

	if result.Error {
		return &supplier, result
	}

	supplier.NamaSupplier = input.NamaSupplier
	supplier.Alamat = input.Alamat

	return &supplier, result
}
