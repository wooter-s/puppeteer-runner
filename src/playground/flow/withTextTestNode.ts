import { Base } from "../..";

export const TestNode =  async (base: Base) => {
    const page = base.page;


    await page.goto('https://ant.design/components/icon-cn/')

    await base.clickQueryWithText('.ant-row > .ant-col > .ant-menu > .ant-menu-item > a','设计')
    await base.clickQueryWithText('.ant-row > .ant-col > .ant-menu > .ant-menu-item > a','文档')

    await base.clickQueryWithText('div > .main-menu-inner > .ant-menu > .ant-menu-item > a','在 create-react-app 中使用')

    await base.clickQueryWithText('div > .main-menu-inner > .ant-menu > .ant-menu-item > a','在 TypeScript 中使用')

    await base.clickQueryWithText('div > .main-menu-inner > .ant-menu > .ant-menu-item > a','更新日志')

    await base.clickQueryWithText('div > .main-menu-inner > .ant-menu > .ant-menu-item > a','定制主题')

    await base.clickQueryWithText('div > .main-menu-inner > .ant-menu > .ant-menu-item > a','替换 Moment.js')

    await base.clickQueryWithText('div > .main-menu-inner > .ant-menu > .ant-menu-item > a','从 v3 到 v4')

};
