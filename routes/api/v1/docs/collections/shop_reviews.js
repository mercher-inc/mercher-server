module.exports = {
    "id":          "ShopReviewsList",
    "required":    [
        "shopReviews",
        "total"
    ],
    "description": "Shop Reviews collection",
    "properties":  {
        "shopReviews": {
            "type":  "array",
            "items": {
                "$ref": "ShopReview"
            }
        },
        "total":       {
            "type":   "integer",
            "format": "int32"
        }
    }
};
