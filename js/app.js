function isEmpty(value) {
    if (value === undefined) return true;
    return value === '';
}

var app = new Vue({
    el: '#app', data: {
        sites: [{name: "youtube", url: "youtube.com", desc: "video hosting", bind: "yt"}, {
            name: "github", url: "github.com", desc: "hosting of IT projects", bind: "gh"
        }], search_line: '', engines: {
            ya: "https://yandex.ru/search/?text=",
            google: "https://www.google.com/search?ie=UTF-8&q=",
            brave: "https://search.brave.com/search?q=",
            ddg: "https://duckduckgo.com/?q=",
            searx: "https://searx.tiekoetter.com/search?q="
        }, engines_show: [], result: [], add: false, to_remove: false, remove_index: 0, engine: 'ya', engine_request: []
    }, methods: {
        search() {
            if (this.search_line[0] !== ':' && this.search_line[0] !== '/') {
                document.location.href = this.engines[localStorage.getItem('engine')] + this.search_line;
            } else if (this.search_line[0] === ':') {
                if (this.result.length === 1) document.location.href = 'https://' + this.result[0]['url'];
            } else {
                if (this.engines_show.length === 1 && !this.to_remove) this.change_engine(this.engines_show[0]);
                if (this.add) {
                    this.sites.push(this.add)
                    localStorage.setItem('sites', JSON.stringify(this.sites))
                    this.search_line = '';
                    this.add = false;
                    this.result = [];
                }

                if (this.to_remove && this.result.length > 0) {
                    this.sites.splice(this.remove_index, 1)
                    localStorage.setItem('sites', JSON.stringify(this.sites))
                    this.remove_index = -1;
                    this.search_line = '';
                    this.to_remove = false;
                    this.result = [];
                }

                if (this.engine_request.length) {
                    this.engines[this.engine_request[0]] = this.engine_request[1]
                    localStorage.setItem('engines', JSON.stringify(this.engines))
                    this.engines_show = [];
                    this.engine_request = [];
                    this.search_line = '';
                }
                if (this.engines_show.length > 0 && this.to_remove) {
                    delete this.engines[this.engines_show[0]]
                    localStorage.setItem('engines', JSON.stringify(this.engines))
                    console.log(this.engines_show[0])
                    let keys = Object.keys(this.engines);
                    if (localStorage.getItem('engine') === this.engines_show[0]) localStorage.setItem('engine', keys[keys.length * Math.random() << 0])
                    this.engines_show = [];
                    this.search_line = '';
                    this.to_remove = false;
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
                document.getElementById('line').focus()
                this.engines_show = [];
                this.search_line = '';
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
                case 'engine':
                    this.scmd_e(argument);
                    break;
                case 'a':
                case 'add':
                    this.scmd_a(argument);
                    break;
                case 'r':
                case 'remove':
                    this.scmd_r(argument);
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
                    this.engines_show.push(key);
                }
            }
        }, scmd_a(argument) {

            if (argument === 'e' || argument === 'engine') {
                let name = this.search_line.slice(1).split(' ')[2];
                let url = this.search_line.slice(1).split(' ')[3];

                if (!isEmpty(name) && !isEmpty(url)) {
                    this.engine_request = [name, url]
                }
                return;
            }

            let name = argument;
            let url = this.search_line.slice(1).split(' ')[2];
            let bind = this.search_line.slice(1).split(' ')[3];
            let desc = this.search_line.slice(1).split(' ')[4];

            if (!isEmpty(name) && !isEmpty(url) && !isEmpty(bind)) {

                for (let i in this.sites) {
                    if (this.sites[i]['name'] === name) {
                        return;
                    }
                }

                this.add = {name: name, url: url, desc: desc, bind: bind};
            } else this.add = false;

        }, scmd_r(argument) {
            this.engines_show = []
            this.to_remove = false;
            this.remove_index = 0;
            if (argument === 'e' || argument === 'engine') {
                let name = this.search_line.slice(1).split(' ')[2];
                if (!isEmpty(name)) {
                    for (let key in this.engines) {
                        if (key.includes(name)) {

                            this.engines_show.push(key);
                            // this.to_remove = true;

                            if (this.engines_show.length === 1) {
                                // this.remove_index = key;
                                this.to_remove = true;
                            }

                            if (argument === this.engines[key]['name']) {
                                // this.remove_index = key;
                                this.to_remove = true;
                            }

                        }
                    }
                }
                return;
            }
            this.result = [];
            if (isEmpty(argument)) {
                return;
            }
            for (let key in this.sites) {
                if (this.sites[key]['name'].includes(argument)) {

                    this.result.push(this.sites[key]);

                    if (this.result.length === 1) {
                        this.remove_index = key;
                        this.to_remove = true;
                    }

                    if (argument === this.sites[key]['name']) {
                        this.remove_index = key;
                        this.to_remove = true;
                    }
                }
            }
        }
    }, mounted() {
        document.getElementById('app').style = "display: flex";
        if (!localStorage.getItem('engine')) {
            localStorage.setItem('engine', this.engine)
        }
        if (!localStorage.getItem('sites')) {
            localStorage.setItem('sites', JSON.stringify(this.sites))
        } else {
            this.sites = JSON.parse(localStorage.getItem('sites'));
        }
        if (!localStorage.getItem('engines')) {
            localStorage.setItem('engines', JSON.stringify(this.engines))
        } else {
            this.engines = JSON.parse(localStorage.getItem('engines'));
        }
    }
})
