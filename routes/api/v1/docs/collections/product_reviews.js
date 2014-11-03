module.exports = {
    "id":          "ProductReviewsList",
    "required":    [
        "productReviews",
        "total"
    ],
    "description": "Product Reviews collection",
    "properties":  {
        "productReviews": {
            "type":  "array",
            "items": {
                "$ref": "ProductReview"
            }
        },
        "total":          {
            "type":   "integer",
            "format": "int32"
        }
    }
};
