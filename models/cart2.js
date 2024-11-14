class Cart {
    constructor() {
        this.data = {}
        this.data.items = []
        this.data.totals = 0
        this.data.formatedTotals = ''
    }

    inCart(productID = 0) {
        let found = false
        this.data.items.forEach(item => {
            if (item.id === productID) found = true
        })
        return found
    }
    calculateTotals() {
        this.data.totals = 0
        this.data.items.forEach(item => {
            let price = item.price
            let qty = item.qty
            let amount = price * qty

            this.data.totals += amount
        })
        this.setFormattedTotals()
    }
    setFormattedTotals() {
        this.data.formatedTotals = new Intl.NumberFormat().format(this.data.totals)
    }
    addToCart(product = null, qty = 1) {
        if (!this.inCart(product.product_id)) {
            let prod = {
                id: product.product_id,
                title: product.name,
                price: product.price,
                qty: qty,
                imagePath: product.imagePath,
                formattedPrice: new Intl.NumberFormat().format(product.price)
            }
            this.data.items.push(prod)
            this.calculateTotals()
        } else {
            console.log('in cart already')
            this.updateCart(product.product_id, qty = 1)
        }
        // console.log(this.data)
    }
    saveCart(req) {
        if (req.session) {
            req.session.cart = this.data
        }
    }
    updateCart(id, qty = 1) {
        for (let item of this.data.items) {
            if (item.id === id) {
                item.qty += qty
                break
            }
        }
        this.calculateTotals()
    }
    removeFromCart(id = 0) {
        for (let i = 0; i < this.data.items.length; i++) {
            let item = this.data.items[i]
            if (item.id === id) {
                this.data.items.splice(i, 1)
                this.calculateTotals()
            }
        }
    }
    emptyCart(req) {
        this.data.items = []
        this.data.totals = 0
        this.data.formatedTotals = ''
        if (req.session) {
            req.session.cart.items = []
            req.session.cart.totals = 0
            req.session.cart.formatedTotals = ''
        }
    }
}

module.exports = new Cart()