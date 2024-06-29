package response

type WebResponse struct {
	Code   int         `json:"Code"`
	Status string      `json:"status"`
	Data   interface{} `json:"data,omitempty"`
}