import { Base, BaseSelectorType } from "../base/Base";
import { Readline } from "../base/util/readline";

class StandardSelector extends Base {
    constructor() {
        super();
    }

    start = async () => {
        await this.page.goto('http://localhost:3000/#/modelCst');

        // 验证码登录
        await this.verificationCodeLogin();


        // await this.flowLogicTableUpdate();

        await this.flowCreateLogicTable();
    }

    // 添加字段
    private async flowLogicTableAddField() {
        await this.clickQueryWithText(BaseSelectorType.BUTTON, "添加字段")
        await this.page.waitFor(300)

        const inputRow = await this.page.$$(`${BaseSelectorType.TABLE_ITEM} ${BaseSelectorType.INPUT}`);
        if (inputRow[0]) {
            await inputRow[0].type("testField")
        }
        if (inputRow[1]) {
            await inputRow[1].type("测试中文名")
        }

        await this.page.click(`${BaseSelectorType.TABLE_ITEM} ${BaseSelectorType.SELECT}`)
        await this.page.waitFor(300);
        await this.clickQueryWithText(BaseSelectorType.SELECT_ITEM, "INT")
    }

    private async flowLogicTableUpdate() {
        // 等待加载左侧导航
        await this.page.waitForSelector(BaseSelectorType.DIRECT_TREE_ORIGIN)

        await this.clickQueryWithText(BaseSelectorType.DIRECT_TREE, "test——2")

        await this.clickQueryWithText(BaseSelectorType.DIRECT_TREE, "表")

        await this.clickQueryWithText(BaseSelectorType.DIRECT_TREE, "db_test_wooter20")

        await this.clickQueryWithText(BaseSelectorType.BUTTON, "编辑")

        await this.flowLogicTableAddField();
        await this.flowLogicTableSave();

    }

    private async flowLogicTableSave() {
        await this.clickQueryWithText(BaseSelectorType.BUTTON, "保存")

        await this.clickQueryWithText(BaseSelectorType.BUTTON, '发布')
        await this.page.waitFor(BaseSelectorType.SELECT)

        await this.clickQueryWithText(BaseSelectorType.SELECT, "请选择数据库")

        // 展开数据库
        // await this.clickSelectorWithText(BaseSelectorType.TREE_NODE_SWITCHER, "")
        await this.page.click(BaseSelectorType.TREE_NODE_SWITCHER)

        await this.clickQueryWithText(BaseSelectorType.TREE_NODE_TITLE, "小机房测试环境/db_finance")

        await this.clickQueryWithText(BaseSelectorType.BUTTON, '确定')
    }

    private async flowCreateLogicTable() {
        await this.clickQueryWithText(BaseSelectorType.MENU_ITEM, "表管理");

        await this.clickQueryWithText(BaseSelectorType.MENU_ITEM, "模型");

        await this.clickQueryWithText(BaseSelectorType.DIRECT_TREE, "test——2");

        await this.hoverChildWithText(BaseSelectorType.DIRECT_TREE, "表", BaseSelectorType.ICON_MORE);
        // await this.hoverQueryWithText(BaseSelectorType.DIRECT_TREE, "表");

        await this.clickQueryWithText(BaseSelectorType.DROPDOWN_SELECT_MENU_ITEM, "新增表");

        await this.page.type(`${BaseSelectorType.INPUT}[placeholder='请输入表名']`, 'test_table_name');
        await this.page.type(`${BaseSelectorType.INPUT}[placeholder='请输入表中文名']`, '测试表名');

        await this.flowLogicTableAddField();

        await this.flowLogicTableSave()

    }

    private verificationCodeLogin = async () => {
        // 输入用户名
        await this.page.type("#fg-username", "15067422155");
        // 勾选发送验证码到钉钉
        await this.page.click("#beleive-ckb");
        // 点击获取验证码
        await this.page.click("#msg_code");

        const answer = await Readline.question("请输入验证码");

        // 输入验证码
        await this.page.type("#fg-code-verify", answer);
        // 点击确认按钮
        await this.page.click("#fgpwd-submit-btn");
    }
}

const standardSelector = new StandardSelector();
standardSelector.run(standardSelector.start)




