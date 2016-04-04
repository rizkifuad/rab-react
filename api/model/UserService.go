package model

import (
	"encoding/json"
	"log"
	"net/http"
)

func (u *User) Update(w http.ResponseWriter, r *http.Request) {
	db := initDb()
	decoder := json.NewDecoder(r.Body)

	var input UserInput
	_ = decoder.Decode(&input)

	u, result := input.ValidateInput("UPDATE")

	if result.Error {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(ParseJSON(result))
		return
	}

	db.Table("user").Where("id = ?", input.ID).Update(u)

	w.Write(ParseJSON(result))

}

func (u *User) Create(w http.ResponseWriter, r *http.Request) {
	db := initDb()
	decoder := json.NewDecoder(r.Body)

	var input UserInput
	_ = decoder.Decode(&input)

	u, result := input.ValidateInput("CREATE")
	if result.Error {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(ParseJSON(result))
		return
	}

	db.Create(&u)
	w.Write(ParseJSON(result))

}

func (u *User) Validate(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)

	var req struct {
		Username string
		Password string
	}
	err := decoder.Decode(&req)

	log.Println(req.Username)
	if err != nil {
		panic(err)
	}

	result := APIMessage{
		Error: false,
	}

	db := initDb()
	db.Where("username = ?", req.Username).First(&u)

	if u.Username != req.Username {
		result.Error = true
	} else {
		valid := u.ValidatePassword(req.Password)

		if !valid {
			result.Error = true
		}

	}

	if !result.Error {
		token := u.GenerateToken()
		result.Message = string(token)
		w.Write(ParseJSON(result))
	} else {
		result.Message = "Incorrect username or password"
		w.WriteHeader(http.StatusUnauthorized)
		w.Write(ParseJSON(result))
	}

}
