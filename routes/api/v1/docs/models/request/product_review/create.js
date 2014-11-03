module.exports = {
    "id":          "ProductReviewCreateRequest",
    "required":    [
        "productId",
        "userId",
        "rating",
        "comment"
    ],
    "description": "Product Review create request model",
    "properties":  {
        "productId": {
            "type":   "integer",
            "format": "int32"
        },
        "userId":    {
            "type":   "integer",
            "format": "int32"
        },
        "rating":    {
            "type":   "integer",
            "format": "int32"
        },
        "comment":   {
            "type": "string"
        }
    }
};
