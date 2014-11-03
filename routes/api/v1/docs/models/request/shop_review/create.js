module.exports = {
    "id":          "ShopReviewCreateRequest",
    "required":    [
        "shopId",
        "userId",
        "rating",
        "comment"
    ],
    "description": "Shop Review create request model",
    "properties":  {
        "shopId":  {
            "type":   "integer",
            "format": "int32"
        },
        "userId":  {
            "type":   "integer",
            "format": "int32"
        },
        "rating":  {
            "type":   "integer",
            "format": "int32"
        },
        "comment": {
            "type": "string"
        }
    }
};
