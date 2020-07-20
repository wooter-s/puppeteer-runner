import { Response } from 'puppeteer'
import { Base, BaseSelectorType } from "../base/Base";
import { Readline } from "../process/readline";
import { IsRecord, RecordManger } from "../base/RecordManger";


class StandardSelector extends Base {
    constructor() {
        super();
    }

    start = async () => {
        await this.page.goto('http://f2e.souche.com/projects/data-fe/data-standard-center/index.html#/standard');
        this.addEventListener()
        // 验证码登录
        // await this.verificationCodeLogin();

        await this.page.waitFor(2000);
        await this.ddlImport();
    }

    private isRecord: IsRecord = (response: Response): boolean => {
        const url = response.url();
        return url.startsWith('http://shangyang.dasouche-inc.net');
    }

    private addEventListener() {
        const recordManger = new RecordManger(this.page, this.isRecord);
        this.page.on("response", recordManger.handle)
    }

    // DDL导入
    private async ddlImport() {
        await this.clickQueryWithText(BaseSelectorType.MENU_ITEM, "表管理");

        await this.clickQueryWithText(BaseSelectorType.MENU_ITEM, "模型");

        await this.clickQueryWithText(BaseSelectorType.DIRECT_TREE, "test——2");

        await this.hoverChildWithText(BaseSelectorType.DIRECT_TREE, "表", BaseSelectorType.ICON_MORE);

        await this.clickQueryWithText(BaseSelectorType.DROPDOWN_SELECT_MENU_ITEM, "新增表");

        await this.hoverQueryWithText(BaseSelectorType.BUTTON, '导入');

        await this.clickQueryWithText(BaseSelectorType.DROPDOWN_SELECT_MENU_ITEM, 'DDL')

        const randomInt = Number(Math.random().toFixed(2)) * 100
        await this.page.type('.view-lines', `
            CREATE EXTERNAL TABLE IF NOT EXISTS \`wooter_test${randomInt}\`(
            \`name\` string COMMENT '张三',\`age\` int COMMENT '年龄',\`money\` float COMMENT '金额',\`address\` string COMMENT '地址',\`gender\` char(254) COMMENT '性别'
            ) COMMENT '沈益程测试表' 
            PARTITIONED BY (\`ds\` date comment '分区字段') 
            STORED AS ORC
            LOCATION 'hdfs://NameNodeHACluster/apps/hive/warehouse/db_finance.db/wooter_test${randomInt}' 
            TBLPROPERTIES('orc.compress'='Gzip')
        `)

        await this.clickQueryWithText(BaseSelectorType.BUTTON, '确定');

        // 关闭tab 再重新开始
        await this.page.waitFor(300)
        await this.clickChildWithText(BaseSelectorType.TAB, "新增表", BaseSelectorType.ICON_CLOSE);

        await this.page.waitFor(2000);
        await this.hoverChildWithText(BaseSelectorType.DIRECT_TREE, "表", BaseSelectorType.ICON_MORE);

        await this.page.waitFor(300);
        await this.clickQueryWithText(BaseSelectorType.DROPDOWN_SELECT_MENU_ITEM, "新增表");

        await this.hoverQueryWithText(BaseSelectorType.BUTTON, '导入');

        await this.clickQueryWithText(BaseSelectorType.DROPDOWN_SELECT_MENU_ITEM, 'HIVE');

        await this.clickQueryWithText(BaseSelectorType.SELECT, '请选择数据库');

        await this.clickQueryWithText(BaseSelectorType.SELECT_ITEM, "db_finance")

        await this.clickQueryWithText(`${BaseSelectorType.SELECT}`, '请选择数据表');

        await this.clickQueryWithText(BaseSelectorType.SELECT_ITEM, "mid_finance_new_car_data_ds");

        await this.clickQueryWithText(BaseSelectorType.BUTTON, '确定');

        await this.flowLogicTableAddField();

        await this.flowLogicTableSave()

    }

    // 添加字段
    private async flowLogicTableAddField() {
        await this.clickQueryWithText(BaseSelectorType.BUTTON, "添加字段")

        await this.page.waitFor(500);
        const inputRow = await this.page.$$(`${BaseSelectorType.TABLE_ITEM} ${BaseSelectorType.INPUT}`);
        if (inputRow[0]) {
            await inputRow[0].type("testField")
        }
        if (inputRow[1]) {
            await inputRow[1].type("测试中文名")
        }

        await this.page.click(`${BaseSelectorType.TABLE_ITEM} ${BaseSelectorType.SELECT}`)

        await this.clickQueryWithText(BaseSelectorType.SELECT_ITEM, "VARCHAR")
    }


    private async flowLogicTableSave() {
        await this.clickQueryWithText(BaseSelectorType.BUTTON, "保存")

        await this.page.waitFor(300)

        await this.clickQueryWithText(BaseSelectorType.BUTTON, '发布')


        await this.clickQueryWithText(BaseSelectorType.SELECT, "请选择数据库")

        // 展开数据库
        // await this.clickSelectorWithText(BaseSelectorType.TREE_NODE_SWITCHER, "")
        await this.page.click(BaseSelectorType.TREE_NODE_SWITCHER)

        await this.clickQueryWithText(BaseSelectorType.TREE_NODE_TITLE, "小机房测试环境/db_finance")

        await this.clickQueryWithText(BaseSelectorType.BUTTON, '确定')
        // const response = await this.page.waitForResponse("http://shangyang.dasouche-inc.net/v2/model/table/logic/release")
        // console.log('------> response', response.json().then((result) => {
        //     console.log('------> result', result);
        // }));
    }

    private async flowCreateLogicTable() {
        await this.clickQueryWithText(BaseSelectorType.MENU_ITEM, "表管理");
        await this.page.waitFor(300);

        await this.clickQueryWithText(BaseSelectorType.MENU_ITEM, "模型");

        await this.clickQueryWithText(BaseSelectorType.DIRECT_TREE, "test——2");

        await this.page.waitFor(300);
        await this.hoverChildWithText(BaseSelectorType.DIRECT_TREE, "表", BaseSelectorType.ICON_MORE);
        // await this.hoverQueryWithText(BaseSelectorType.DIRECT_TREE, "表");

        await this.page.waitFor(200);
        await this.clickQueryWithText(BaseSelectorType.DROPDOWN_SELECT_MENU_ITEM, "新增表");

        await this.page.waitFor(500);
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




