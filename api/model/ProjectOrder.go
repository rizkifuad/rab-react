package model

import (
	"fmt"
	"strconv"

	"github.com/jinzhu/gorm"
)

type ProjectOrder struct {
	AnggaranId uint
	BarangId   uint
	Jumlah     int
	gorm.Model
}

func (order *ProjectOrder) GetOrders(id int) []ProjectOrder {
	db := initDb()
	var orders []ProjectOrder

	db.Table("order").Select("*").Where("anggaran_id = ?", id).Find(&orders)
	return orders
}

func (order *ProjectOrder) GetByID(id int) {
	db := initDb()
	db.Where("id = ?", id).Find(&order)
}

type ProjectOrderInput struct {
	AnggaranId string
	BarangId   string
	Jumlah     string
	ID         string `json:"id"`
}

func (input *ProjectOrderInput) ValidateInput(action string) (*ProjectOrder, APIMessage) {
	result := APIMessage{
		Error:   false,
		Message: fmt.Sprintf("Successfully %s order", action),
	}
	var order ProjectOrder

	if input.AnggaranId == "" {
		result.Error = true
		result.Message = "Anggaran kosong"
	}

	if input.BarangId == "" {
		result.Error = true
		result.Message = "Barang kosong"
	}

	if input.Jumlah == "" {
		result.Error = true
		result.Message = "Jumlah kosong"
	}

	if result.Error {
		return &order, result
	}

	AnggaranId, _ := strconv.ParseUint(input.AnggaranId, 10, 32)
	BarangId, _ := strconv.ParseUint(input.BarangId, 10, 32)

	order.AnggaranId = uint(AnggaranId)
	order.BarangId = uint(BarangId)

	order.Jumlah, _ = strconv.Atoi(input.Jumlah)

	return &order, result
}
