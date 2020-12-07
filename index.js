const app = new Vue({
    el: '#app',
    data: {
        propertyCost: null,
        initialPayment: null,
        initialPercent: [
            {number: '10%', active: false},
            {number: '15%', active: false},
            {number: '20%', active: false},
            {number: '25%', active: false},
            {number: '30%', active: false},
        ],
        creditTerm: null,
        creditPercent: null,
        linkData: false,
    },
    computed: {
        monthlyPayment: function() {
            if (this.loan !== null && this.creditPercent !== null && this.creditTerm !== null && this.creditPercent !== "" && this.creditTerm !== "") {
                let loan = this.convertDataTypes(this.loan);
                let creditPercent = this.convertDataTypes(this.creditPercent);
                let creditTerm = this.convertDataTypes(this.creditTerm)*12;
                let result = loan * ((creditPercent/1200) + ((creditPercent/1200) / (Math.pow(1 + (creditPercent/1200), creditTerm) - 1)));
                result = Math.round(result)
                result = this.convertDataTypes(result);
                result = this.makeNumberWithSpaces(result);
                return result;
            } else {
                return;
            }
        },
        requiredIncome: function() {
            if (this.monthlyPayment !== undefined) {
                let monthlyPayment = this.convertDataTypes(this.monthlyPayment);
                result = Math.round(5 * (monthlyPayment/3));
                result = this.convertDataTypes(result);
                result = this.makeNumberWithSpaces(result);
                return result;
            } else {
                return;
            }
        },
        overPayment: function() {
            if (this.monthlyPayment !== undefined && this.creditTerm !==null && this.propertyCost !== null && this.initialPayment !== null && this.creditTerm !== "") {
                let monthlyPayment = this.convertDataTypes(this.monthlyPayment);
                let creditTerm = this.convertDataTypes(this.creditTerm)*12;
                let cost = this.convertDataTypes(this.propertyCost);
                let payment = this.convertDataTypes(this.initialPayment);
                let result = Math.round((monthlyPayment * creditTerm) - cost + payment);
                result = this.convertDataTypes(result);
                result = this.makeNumberWithSpaces(result);
                return result;
            } else {
                return;
            }
        },
        loan: function() {
            if (this.propertyCost !== null && this.initialPayment !== null) {
                let cost = this.convertDataTypes(this.propertyCost);
                let payment = this.convertDataTypes(this.initialPayment);
                result = cost - payment;
                result = this.convertDataTypes(result);
                result = this.makeNumberWithSpaces(result);
                return result;
            } else {
                return;
            } 
        },
        declensionOfYears: function() {
            if (this.creditTerm !== null) {
                if (this.creditTerm[this.creditTerm.length-1] >=2 && this.creditTerm[this.creditTerm.length-1] <=4 && this.creditTerm[this.creditTerm.length-2] != 1) {
                    return 'года';
                }
                else if (this.creditTerm[this.creditTerm.length-1] == 1 && this.creditTerm[this.creditTerm.length-2] != 1) {
                    return 'год';
                }
                else {
                    return 'лет';
                }
            }
            else {
                return 'лет';
            }
        }
    },
    methods: {
        // save fields in local storage
        saveFields() {
            let savedForm = {
                'propertyCost': this.propertyCost,
                'initialPayment': this.initialPayment,
                'initialPercent': this.initialPercent,
                'creditTerm': this.creditTerm,
                'creditPercent': this.creditPercent,
                'linkData': this.linkData
            }
            localStorage.setItem('savedForm', JSON.stringify(savedForm))
        },
        // clear fields and remove savedForm from local storage
        clearFields() {
            this.propertyCost = null;
            this.initialPayment = null;
            this.initialPercent = [
                {number: '10%', active: false},
                {number: '15%', active: false},
                {number: '20%', active: false},
                {number: '25%', active: false},
                {number: '30%', active: false},
            ];
            this.creditTerm = null;
            this.creditPercent = null;
            this.linkData = false;

            localStorage.removeItem('savedForm');
        },
        changeInitialPercent(num) {
            let currentElem = this.initialPercent.find(item => item.number === num);
            // remove 'active class' in a double click and from 'sibling elements'
            this.initialPercent.forEach(item => {
                if (item === currentElem) {
                    currentElem.active === false ? 
                        (currentElem.active = true, 
                        this.linkData = true,
                        this.linkCostAndInitialPayment('click')) 
                        : 
                        (currentElem.active = false,
                        this.linkData = false);
                } else {
                    item.active = false;
                }
            });
        },
        convertDataTypes(data) {
            // convert from string to number
            if (typeof(data) === 'string') {
                data = Number(data.split("").filter(item => item !== " ").join(""));
            }
            // convert from number to string
            else if (typeof(data) === 'number') {
               data = String(data);
            }
            else {
                return;
            }
            return data;
        },
        linkCostAndInitialPayment(method, elem = undefined) {
            if (this.linkData === true) {
                let cost = this.propertyCost;
                let payment = this.initialPayment;
                // get active percent
                let percent = parseInt(this.initialPercent.find(item => item.active === true).number);
                // check call method
                if (method === 'click') {
                    if (cost === null && payment === null) {
                        return
                    } else if (cost === null || payment === null) {
                        if (cost === null) {
                            payment = this.convertDataTypes(this.initialPayment);
                            cost = Math.round(payment*100/percent);
                        } else {
                            cost = this.convertDataTypes(this.propertyCost);
                            payment = Math.round(cost*percent/100);
                        }
                    } else {
                        cost = this.convertDataTypes(this.propertyCost);
                        payment = Math.round(cost*percent/100);
                    }
                } else {
                    if (elem === 'cost') {
                        cost = this.convertDataTypes(this.propertyCost);
                        payment = Math.round(cost*percent/100);
                    }
                    else {
                        payment = this.convertDataTypes(this.initialPayment);
                        cost = Math.round(payment*100/percent);
                    }
                }
                // convert to string type
                cost = this.convertDataTypes(cost);
                payment = this.convertDataTypes(payment);
                // return spaces
                this.makeNumberWithSpaces(cost, 'propertyCost');
                this.makeNumberWithSpaces(payment, 'initialPayment');
            }
        },
        makeNumberWithSpaces(num, title = undefined) {
            num = Array.from(num).filter(item => item !== " ");
            let result = [];
            for (let i=num.length-1;i>=0;i--) {
                if (result.length>0 && result.filter(item => item !== " ").length%3 == 0) {
                    result.push(' ');
                    result.push(num[i]);
                }
                else {             
                    result.push(num[i]);
                }
            }
            if (title !== undefined) {
                this[title] = result.reverse().join("");
            }
            else {
                return result.reverse().join("");
            }
            
        },
        checkLocalStorage() {
            if (localStorage.getItem('savedForm') !== null) {
                let savedForm = JSON.parse(localStorage.getItem('savedForm'));
                for (let key in savedForm) {
                    this[key] = savedForm[key];
                };
            };
        }
    },
    mounted(){
        this.checkLocalStorage();
    }
});

