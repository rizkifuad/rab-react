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

	var result struct {
		OrderDitolak      int
		OrderPending      int
		OrderApproved     int
		OrderDicetak      int
		TotalOrder        int
		TotalBarang       int
		TotalHarga        int
		PembayaranPending int
		PembayaranDiinput int
		PembayaranLunas   int
	}

	result.OrderDitolak = len(order.GetByStatus(id, 3))
	result.OrderDicetak = len(order.GetByStatus(id, 2))
	result.OrderApproved = len(order.GetByStatus(id, 1))
	result.OrderPending = len(order.GetByStatus(id, 0))

	result.TotalOrder = len(order.GetOrders(id))
	result.TotalBarang = order.GetCountBarangs(id)

	result.TotalHarga = pembayaran.GetTotalHarga(id)
	result.PembayaranPending = len(pembayaran.GetByStatus(id, 0))
	result.PembayaranDiinput = len(pembayaran.GetByStatus(id, 1))
	result.PembayaranLunas = len(pembayaran.GetByStatus(id, 2))

	w.Write(ParseJSON(result))
}
