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
	Status     int
	SupplierId int
	Cetak      int
	UserId     int
	Kegunaan   string
	gorm.Model
}
type TotalOrder struct {
	NamaBarang     string
	JumlahAnggaran uint
	JumlahOrder    uint
	Status         int
}

func (order *TotalOrder) GetTotalOrder(id int) []TotalOrder {
	//db := initDb()

	var result []TotalOrder

	db.Raw("select *, jumlah_order > jumlah_anggaran as status from (select barang_id, sum(jumlah) as jumlah_order from project_order po  where anggaran_id=? and deleted_at is null and status<>3 group by barang_id) po,(select barang_id, sum(jumlah) as jumlah_anggaran from anggaran_detail ad where anggaran_id=? and deleted_at is null group by barang_id) ad  join barang b on b.id=barang_id where po.barang_id=ad.barang_id;", id, id).
		Scan(&result)

	return result
}

type OrderBarangSummary struct {
	BarangId int
	Jumlah   int
}

func (order *ProjectOrder) CountBarang(id int, barangId int) int {
	//db := initDb()

	var result struct {
		Jumlah int
	}

	db.Table("project_order").Select("barang_id, sum(jumlah) as jumlah").Where("anggaran_id=? AND barang_id=?", id, barangId).Group("barang_id").Scan(&result)
	return result.Jumlah
}

func (order *ProjectOrder) GetOrders(id int) []ProjectOrder {
	//db := initDb()
	var orders []ProjectOrder

	db.Table("project_order").Select("*").Where("anggaran_id = ?", id).Find(&orders)
	return orders
}

//func (order *ProjectOrder) GetTotalOrders(id int) int {
////db := initDb()
//var orders struct {
//TotalOrder int
//}

//db.Table("project_order").Select("*").Where("anggaran_id = ? and status <> 0", id).Scan(&orders)
//return orders
//}

func (order *ProjectOrder) GetCountBarangs(id int) int {
	//db := initDb()
	var orders struct {
		TotalBarang int
	}

	db.Table("project_order").Select("sum(jumlah) total_barang").Where("anggaran_id = ?", id).Scan(&orders)
	return orders.TotalBarang
}
func (order *ProjectOrder) GetCountBarangsSummary(id int) []OrderBarangSummary {
	//db := initDb()
	var results []OrderBarangSummary

	db.Table("project_order").Select("barang_id, sum(jumlah) jumlah").Group("barang_id").Where("anggaran_id = ?", id).Scan(&results)
	return results
}

func (order *ProjectOrder) GetByID(id int) {
	//db := initDb()
	db.Where("id = ?", id).Find(&order)
}

func (order *ProjectOrder) GetByStatus(id int, status int) []ProjectOrder {
	//db := initDb()
	var o []ProjectOrder
	db.Where("anggaran_id = ? and status=?", id, status).Find(&o)

	return o
}

type ProjectOrderInput struct {
	AnggaranId string `json:"anggaran_id"`
	BarangId   string `json:"barang_id"`
	Jumlah     string `json:"jumlah"`
	Kegunaan   string `json:"kegunaan"`
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
	order.Kegunaan = input.Kegunaan

	order.Jumlah, _ = strconv.Atoi(input.Jumlah)

	return &order, result
}
