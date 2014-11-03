module.exports = {
    "id":          "ShopReviewUpdateRequest",
    "required":    [
        "rating",
        "comment"
    ],
    "description": "Shop Review update request model",
    "properties":  {
        "rating":  {
            "type":   "integer",
            "format": "int32"
        },
        "comment": {
            "type": "string"
        }
    }
};
