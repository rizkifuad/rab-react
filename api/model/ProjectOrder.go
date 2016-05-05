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
type TotalOrder struct {
	NamaBarang     string
	JumlahAnggaran uint
	JumlahOrder    uint
	Status         int
}

func (order *TotalOrder) GetTotalOrder(id int) []TotalOrder {
	db := initDb()

	var result []TotalOrder
	db.Table("project_order po").
		Select("nama_barang, sum(po.jumlah) as jumlah_order, sum(ad.jumlah) as jumlah_anggaran, sum(po.jumlah) > sum(ad.jumlah) as status").
		Joins("join anggaran_detail ad on ad.anggaran_id=po.anggaran_id").
		Joins("join barang b on b.id=po.barang_id").
		Group("po.barang_id").
		Where("po.anggaran_id=?", id).Find(&result)
	return result
}

func (order *ProjectOrder) CountBarang(id int, barangId int) int {
	db := initDb()

	var result struct {
		Jumlah int
	}

	db.Table("project_order").Select("sum(jumlah) as jumlah").Where("anggaran_id=? AND barang_id=?", id, barangId).Scan(&result)
	return result.Jumlah
}

func (order *ProjectOrder) GetOrders(id int) []ProjectOrder {
	db := initDb()
	var orders []ProjectOrder

	db.Table("project_order").Select("*").Where("anggaran_id = ?", id).Find(&orders)
	return orders
}

func (order *ProjectOrder) GetByID(id int) {
	db := initDb()
	db.Where("id = ?", id).Find(&order)
}

type ProjectOrderInput struct {
	AnggaranId string `json:"anggaran_id"`
	BarangId   string `json:"barang_id"`
	Jumlah     string `json:"jumlah"`
}

func (input *ProjectOrderInput) ValidateInput(action string) (*ProjectOrder, APIMessage) {
	result := APIMessage{
		Error:   false,
		Message: fmt.Sprintf("Successfully %s order", action),
	}
	var order ProjectOrder

	fmt.Printf("%+v", input)

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
