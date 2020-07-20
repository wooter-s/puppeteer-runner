import { Base, BaseSelectorType } from "../base/Base";

class Hover extends Base {
    constructor() {
        super();
    }

    start = async () => {
        await this.page.goto("http://localhost:3000");
        // 监听要放在启动页面之后，不然可能解析不到结果
        this.addEventListener();
    }

    private addEventListener() {
        this.page.on("response", async (response) => {
            console.log('------> response.url()', await response.url());
            // if (response.url().startsWith('https://shangyang.dasouche-inc.net')) {
            //     if (response.ok()) {
            //         console.log('------> response', await response.json());
            //     } else {
            //         console.log('------> err', await response.statusText());
            //     }
            // }
        })
    }
}

const hover = new Hover();
hover.run(hover.start)
