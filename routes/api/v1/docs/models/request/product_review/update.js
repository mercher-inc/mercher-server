module.exports = {
    "id":          "ProductReviewUpdateRequest",
    "required":    [
        "rating",
        "comment"
    ],
    "description": "Product Review update request model",
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
