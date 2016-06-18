package model

import "net/http"

type Report struct {
	BelumApprove int
	Dicetak      int
	Ditolak      int

	Lunas           int
	BelumBayar      int
	BelumInputBayar int
	JumlahLunas     int
	JumlahHutang    int
}

func (report *Report) GetReports() []Report {
	//db := initDb()
	var reports []Report

	db.Table("report").Select("*").Find(&reports)
	return reports
}

func (report *Report) GetByID(id int) {
	//db := initDb()
	db.Where("id = ?", id).Find(&report)
}

func (report *Report) All(w http.ResponseWriter, r *http.Request) {

}
