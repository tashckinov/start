function isEmpty(value) {
    if (value === undefined) return true;
    return value === '';
}

var app = new Vue({
    el: '#app', data: {
        message: 'Noject',
        sites: [{
            name: "youtube", url: "youtube.com", desc: "videohosting", bind: "yt"
        }, {
            name: "github", url: "github.com", desc: "hosting of IT projects", bind: "gh"
        }], search_line: '', engines: {
            ya: "https://yandex.ru/search/?text=",
            google: "https://www.google.com/search?ie=UTF-8&q=",
            ddg: "https://duckduckgo.com/?q=",
            searx: "https://searx.tiekoetter.com/search?q="
        }, engines_show: [], result: [], add: false, to_remove: false, remove_index: -1, engine: 'ya'
    }, methods: {
        search() {
            if (this.search_line[0] !== ':' && this.search_line[0] !== '/') {
                document.location.href = this.engines[localStorage.getItem('engine')] + this.search_line;
            } else if (this.search_line[0] === ':') {
                if (this.result.length === 1) document.location.href = 'https://' + this.result[0]['url'];
            } else {
                if (this.engines_show.length === 1) this.change_engine(this.engines_show[0]);
                if (this.add) {
                    this.sites.push(this.add)
                    localStorage.setItem('sites', JSON.stringify(this.sites))
                    this.search_line = ''
                }
                if (this.to_remove && this.result.length === 1) {
                    this.sites.splice(this.remove_index, 1)
                    this.result = []
                    this.search_line = ''
                    localStorage.setItem('sites', JSON.stringify(this.sites))
                }
            }
        }, input_check() {
            switch (this.search_line[0]) {
                case ':':
                    this.bind();
                    break;
                case '/':
                    this.scmd();
                    break;
                default:
                    this.engines_show = [];
                    this.result = [];
                    break;
            }
        }, change_engine(engine) {
            if (engine in this.engines) {
                localStorage.setItem('engine', engine)
                this.search_line = '';
                document.getElementById('line').focus()
                this.engines_show = [];
            }
        }, bind() {
            this.result = [];
            for (let key in this.sites) {
                if (this.sites[key]['bind'].includes(this.search_line.slice(1))) {
                    this.result.push(this.sites[key]);
                }
            }
        }, scmd() {
            let command = this.search_line.slice(1).split(' ')[0]
            let argument = this.search_line.slice(1).split(' ')[1]
            switch (command) {
                case 'e':
                    this.scmd_e(argument);
                    break;
                case 'a':
                    this.scmd_a(argument);
                    break;
                case 'd':
                    this.scmd_d(argument);
                    break;
                default:
                    this.engines_show = [];
                    break;
            }
        }, scmd_e(argument) {
            if (argument === undefined) argument = '';
            this.engines_show = []
            for (let key in this.engines) {
                if (key.includes(argument)) {
                    this.engines_show.push(key)
                }
            }
        }, scmd_a(argument) {
			let name = argument;
			let url = this.search_line.slice(1).split(' ')[2]
			let bind = this.search_line.slice(1).split(' ')[3]
			let desc = this.search_line.slice(1).split(' ')[4]

			if (!isEmpty(name) && !isEmpty(url) && !isEmpty(bind)) {
				this.add = {name: name, url: url, desc: desc, bind: bind};
			} else this.add = false;
        }, scmd_d(argument) {
			this.result = []
			this.to_remove = false;

			if (!isEmpty(argument)) {
				for (let key in this.sites) {
					if (this.sites[key]['name'].includes(argument)) {
						this.result.push(this.sites[key]);
						this.remove_index = findIndex(function (sites) {
							return sites.name = key
						};
						this.to_remove = true;
					}
				}
			}
        }
    }, mounted() {
        if (!localStorage.getItem('engine')) {
            localStorage.setItem('engine', this.engine)
        }
        if (!localStorage.getItem('sites')) {
            localStorage.setItem('sites', JSON.stringify(this.sites))
        } else {
            this.sites = JSON.parse(localStorage.getItem('sites'));
        }
    }
})
