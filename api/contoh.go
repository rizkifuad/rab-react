package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/go-gorp/gorp"
	_ "github.com/go-sql-driver/mysql"
)

type TransactionTimeline struct {
	SDate          string
	STime          string
	SalesNo        int64
	TDate          string
	Alias          string `db:"alias"`
	Icon           string `db:"icon"`
	Point          int64  `db:"point"`
	Total_spending int64  `db:"total_spending"`
	Qty            int64  `db:"qty"`
	Amount         int64  `db:"amount"`
	Description    string `db:"description"`
}

type Member struct {
	MemberId  int64 `db:"memberId"`
	FirstName string
	LastName  string
}

func main2() {

	db, err := sql.Open("mysql", "member:Love3Love@tcp(db.member.id:3306)/memberidrelease")
	defer db.Close()
	fmt.Println("connection success")
	// Prepare statement for reading data

	query := `
  SELECT t.SalesNo, alias, td.amount, t.Spent as total_spending, description, qty, t.SDate, t.STime, point,
  concat(date_format(t.STime, '%H:%i'), ' ', date_format(t.SDate, '%d/%m/%Y')) as TDate,
  IF(concept = 'Restaurant', 'wine.png', 'eat.png') as icon
  From transactions t
  JOIN transactiondetail td on t.SalesNo = td.SalesNo and t.Outlet=td.Outlet
  JOIN outlet o on o.outletId = t.Outlet where t.memberId = 10106117 order by t.SDate, t.STime desc`

	//var memberid = strconv.Itoa(10106117)
	dbmap := &gorp.DbMap{Db: db, Dialect: gorp.MySQLDialect{"InnoDB", "UTF8"}}
	var transactions []TransactionTimeline

	//t3 := dbmap.AddTableWithName(TransactionTimeline{}, "transactions").SetKeys(true, "id")
	//query2 := `select memberId, FirstName, LastName from member where memberId IS NOT NULL`
	_, err = dbmap.Select(&transactions, query)
	if err != nil {
		panic(err.Error())
	}

	type TimelineDetail struct {
		Qty         int64
		Description string
		Amount      int64
	}

	type Timeline struct {
		SalesNo        int64
		TDate          string
		Alias          string `db:"alias"`
		Icon           string `db:"icon"`
		Point          int64  `db:"point"`
		Total_spending int64  `db:"total_spending"`
		Detail         []TimelineDetail
	}

	var x []Timeline
	var k = -1

	for i, el := range transactions {
		if i == 0 || (el.SalesNo != transactions[i-1].SalesNo) {
			k++
			var trx = Timeline{
				SalesNo:        el.SalesNo,
				Alias:          el.Alias,
				Icon:           el.Icon,
				TDate:          el.TDate,
				Point:          el.Point,
				Total_spending: el.Total_spending,
				Detail:         []TimelineDetail{},
			}
			x = append(x, trx)
		}

		var detail = TimelineDetail{
			Qty:         el.Qty,
			Amount:      el.Amount,
			Description: el.Description,
		}

		x[k].Detail = append(x[k].Detail, detail)
	}

	for i := 0; i < len(x); i++ {
		for j := i + 1; j < len(x); j++ {
			now := time.Now()
			bdate, _ := time.Parse("15:04 02/01/2006", x[i].TDate)
			adate, _ := time.Parse("15:04 02/01/2006", x[j].TDate)

			bdiff := now.Sub(bdate)
			adiff := now.Sub(adate)

			if bdiff > adiff {
				var temp = x[i]
				x[i] = x[j]
				x[j] = temp
			}
		}
	}

	b, err := json.Marshal(x)
	if err != nil {
		panic(err.Error())
	}

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write(b)
	})

	log.Fatal(http.ListenAndServe(":7000", nil))
}
