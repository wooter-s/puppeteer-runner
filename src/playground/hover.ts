import { Base, BaseSelectorType } from "../base/Base";

class Hover extends Base {
    constructor() {
        super();
    }

    start = async () => {
        await this.page.goto("https://ant.design/index-cn", { waitUntil: "domcontentloaded"});

        await this.clickQueryWithText(BaseSelectorType.MENU_ITEM, '组件');
        await this.page.waitFor(300);

        await this.clickQueryWithText(BaseSelectorType.MENU_ITEM, "Dropdown下拉菜单");
        await this.page.waitFor(300);

        await this.hoverQueryWithText(BaseSelectorType.DROPDOWN_LINK, "Hover me ");
        await this.page.waitFor(300);

        await this.clickQueryWithText(BaseSelectorType.DROPDOWN_SELECT_MENU_ITEM, "2nd menu item");

    }
}

const hover = new Hover();
hover.run(hover.start);
