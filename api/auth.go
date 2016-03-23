package main

import (
	"encoding/json"
	"net/http"
	"rizki/rab/api/model"
	"time"

	"github.com/dgrijalva/jwt-go"
)

type Token struct {
	Token    string
	Exp      interface{}
	Role     interface{}
	Username interface{}
	User     model.User
}

func auth(w http.ResponseWriter, r *http.Request) {
	//vars := mux.Vars(r)
	// Create the token
	token := jwt.New(jwt.SigningMethodHS256)
	// Set some claims
	token.Claims["username"] = "admin"
	token.Claims["role"] = "admin"
	token.Claims["exp"] = time.Now().Add(time.Hour * 72).Unix()
	// Sign and get the complete encoded token as a string
	mySigningKey := []byte("secret")
	tokenString, err := token.SignedString(mySigningKey)

	if err == nil {
		t := Token{
			Token:    tokenString,
			Exp:      token.Claims["exp"],
			Role:     token.Claims["role"],
			Username: token.Claims["username"],
		}

		b, err := json.Marshal(t)
		println(tokenString)

		if err != nil {
			panic(err.Error())
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write(b)
	} else {
		w.Write([]byte("Unexpected error"))
	}
}
