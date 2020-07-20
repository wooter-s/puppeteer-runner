import { Base } from "../base/Base";
import { querySelectorWithText } from "../util/selector";

class Selector extends Base {
    constructor() {
        super();
    }

    start = async () => {
        await this.page.goto("https://juejin.im/");
        await this.page.waitForSelector('li.nav-item a');

        await this.clickQueryWithText("li.nav-item a", "人工智能");

        await this.page.waitFor(1000);
        await this.clickQueryWithText("li.nav-item a", "IOS");

        await this.page.waitFor(1000);
        await this.clickQueryWithText("li.nav-item a", "Android");

        await this.page.waitFor(1000);
        await this.clickQueryWithText("li.nav-item a", "开发工具");
        // const query: string = "li.nav-item";
        // const text = "Android";
        // const androidTab = await this.page.evaluate(() => {
        //     // const target1 = querySelectorWithText('li.nav-item', 'Android');
        //     // console.log('------> target1', target1);
        //     const target = document.querySelectorAll(query);
        //     console.log('------> target', target);
        //     return {
        //         target
        //     }
        //
        //
        //     // target.forEach((item) => {
        //     //     if (item.innerHTML !== text) {
        //     //         return;
        //     //     }
        //     //     result = item;
        //     // });
        //     // return result
        // })

        // document.querySelectorAll('div[id="juejin"]')
    }
}

const select = new Selector();
select.run(select.start)
