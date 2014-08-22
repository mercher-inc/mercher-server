module.exports = {
    "id":          "CraftsmenList",
    "required":    [
        "craftsmen",
        "total"
    ],
    "description": "Craftsmen collection",
    "properties":  {
        "craftsmen": {
            "type":  "array",
            "items": {
                "$ref": "Craftsman"
            }
        },
        "total":     {
            "type":   "integer",
            "format": "int32"
        }
    }
};
