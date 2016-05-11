package model

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

func (order *ProjectOrder) Update(w http.ResponseWriter, r *http.Request) {
	//db := initDb()
	decoder := json.NewDecoder(r.Body)

	var input ProjectOrderInput
	_ = decoder.Decode(&input)

	order, result := input.ValidateInput("UPDATE")

	if result.Error {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(ParseJSON(result))
		return
	}

	//db.Table("project_order").Where("id = ?", input.ID).Update(order)

	w.Write(ParseJSON(result))

}

func (order *ProjectOrder) Create(w http.ResponseWriter, r *http.Request) {
	println("Save")
	db := initDb()
	decoder := json.NewDecoder(r.Body)
	fmt.Printf("%v", r.Body)

	var input ProjectOrderInput
	_ = decoder.Decode(&input)

	fmt.Printf("%+v", input)

	order, result := input.ValidateInput("CREATE")
	if result.Error {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(ParseJSON(result))
		return
	}

	db.Create(&order)
	w.Write(ParseJSON(result))
}

func (order *ProjectOrder) PrepareCreate(w http.ResponseWriter, r *http.Request) {

	var result struct {
		Barangs []Barang
	}

	var b Barang

	result.Barangs = b.GetBarangs()

	w.Write(ParseJSON(result))
}

func (order *ProjectOrder) PrepareUpdate(w http.ResponseWriter, r *http.Request) {
	println("menggila")

	vars := mux.Vars(r)
	id, _ := strconv.Atoi(vars["id"])
	order.ID = uint(id)

	order.GetByID(id)

	var result struct {
		Anggaran   Anggaran
		Order      []ProjectOrder
		Barangs    []BarangAnggaran
		TotalOrder []TotalOrder
	}

	var anggaran Anggaran
	var totalOrder TotalOrder
	anggaran.GetByID(id)

	result.Order = order.GetOrders(id)
	result.Anggaran = anggaran
	result.Barangs = anggaran.GetBarang(id)
	result.TotalOrder = totalOrder.GetTotalOrder(id)

	w.Write(ParseJSON(result))
}

func (order *ProjectOrder) List(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, _ := strconv.Atoi(vars["id"])
	orders := order.GetOrders(id)
	w.Write(ParseJSON(orders))
}
func (order *ProjectOrder) Check(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, _ := strconv.Atoi(vars["id"])
	jumlah, _ := strconv.Atoi(vars["jumlah"])
	barangId, _ := strconv.Atoi(vars["barangId"])

	var anggaranDetail AnggaranDetail

	totalAnggaran := anggaranDetail.CountBarang(id, barangId)
	totalOrder := order.CountBarang(id, barangId)

	totalOrders := totalOrder + jumlah

	var result struct {
		Error   bool
		Message string
	}

	result.Error = false
	result.Message = ""

	if totalOrders > totalAnggaran {
		result.Error = true
		result.Message = "Total order sudah melebihi total anggaran. Apakah anda ingin melanjutkan?"
	}
	w.Write(ParseJSON(result))

	println(totalAnggaran)
	println(totalOrder)
	println(jumlah)

}

func (porder *ProjectOrder) Approve(w http.ResponseWriter, r *http.Request) {
	db := initDb()
	vars := mux.Vars(r)
	id, _ := strconv.Atoi(vars["id"])

	var order ProjectOrder

	order.GetByID(id)
	order.Status = 1

	db.Table("project_order").Where("id = ?", id).Update(order)

	w.Write(ParseJSON(order))

}

func (porder *ProjectOrder) Tolak(w http.ResponseWriter, r *http.Request) {
	db := initDb()
	vars := mux.Vars(r)
	id, _ := strconv.Atoi(vars["id"])

	var order ProjectOrder

	order.GetByID(id)
	order.Status = 3

	db.Table("project_order").Where("id = ?", id).Update(order)

	w.Write(ParseJSON(order))

}

func (order *ProjectOrder) CetakOrder(w http.ResponseWriter, r *http.Request) {
	db := initDb()
	vars := mux.Vars(r)
	id, _ := strconv.Atoi(vars["id"])

	var result struct {
		Max int
	}
	db.Raw("select ifnull(max(cetak),0) as max from project_order where anggaran_id=?", id).
		Scan(&result)
	nextCetak := result.Max + 1

	db.Exec("UPDATE project_order SET Cetak=?, status=2 WHERE status = 1 and anggaran_id=?", nextCetak, id)

	w.Write(ParseJSON(order))

}
