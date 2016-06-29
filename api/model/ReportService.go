package model

import (
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

func (report *Report) List(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, _ := strconv.Atoi(vars["id"])

	var order ProjectOrder
	var pembayaran Pembayaran
	var barang Barang
	var supplier Supplier

	var result struct {
		OrderDitolak      []ProjectOrder
		OrderPending      []ProjectOrder
		OrderApproved     []ProjectOrder
		OrderDicetak      []ProjectOrder
		TotalOrder        int
		TotalBarang       int
		TotalHarga        int
		PembayaranPending []PembayaranDetail
		PembayaranDiinput []PembayaranDetail
		PembayaranLunas   []PembayaranDetail
		Barang            []Barang
		Supplier          []Supplier
	}

	result.OrderDitolak = order.GetByStatus(id, 3)
	result.OrderDicetak = order.GetByStatus(id, 2)
	result.OrderApproved = order.GetByStatus(id, 1)
	result.OrderPending = order.GetByStatus(id, 0)

	result.TotalOrder = len(order.GetOrders(id))
	result.TotalBarang = order.GetCountBarangs(id)

	result.TotalHarga = pembayaran.GetTotalHarga(id)
	result.PembayaranPending = pembayaran.GetByStatus(id, 0)
	result.PembayaranDiinput = pembayaran.GetByStatus(id, 1)
	result.PembayaranLunas = pembayaran.GetByStatus(id, 2)

	result.Barang = barang.GetBarangs()
	result.Supplier = supplier.GetSuppliers()

	w.Write(ParseJSON(result))
}
