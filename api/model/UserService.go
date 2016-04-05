package model

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
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
	var user User
	db.Where("username = ?", req.Username).Find(&user)

	if user.Username != req.Username {
		result.Error = true
	} else {
		valid := user.ValidatePassword(req.Password)
		println(user.Encrypt("admin"))

		if !valid {
			result.Error = true
		}

	}

	if !result.Error {
		token := user.GenerateToken()
		result.Message = string(token)
		w.Write(ParseJSON(result))
	} else {
		result.Message = "Incorrect username or password"
		w.WriteHeader(http.StatusUnauthorized)
		w.Write(ParseJSON(result))
	}

}
func (user *User) PrepareCreate(w http.ResponseWriter, r *http.Request) {
	var result struct {
		Role []string
	}
	result.Role = GetEnums("user", "role")
	w.Write(ParseJSON(result))
}
func (u *User) PrepareUpdate(w http.ResponseWriter, r *http.Request) {
	var result struct {
		User User
		Role []string
	}

	vars := mux.Vars(r)
	id, _ := strconv.Atoi(vars["id"])
	u.ID = uint(id)

	u.GetByID(id)
	result.User = *u
	result.Role = GetEnums("user", "role")

	w.Write(ParseJSON(result))
}
func (user *User) CheckToken(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)

	var req struct {
		Token string
	}
	_ = decoder.Decode(&req)

	valid := user.ValidateToken(req.Token)
	var result APIMessage

	if valid {
		result.Error = false
		w.Write(ParseJSON(result))
	} else {
		result.Error = true
		result.Message = "Invalid token"
		w.WriteHeader(http.StatusUnauthorized)
		w.Write(ParseJSON(result))
	}
}
func (user *User) List(w http.ResponseWriter, r *http.Request) {
	users := user.GetUsers()
	w.Write(ParseJSON(users))
}
