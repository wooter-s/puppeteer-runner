import { Base } from "../../..";

export const TreeSelectNode =  async (base: Base) => {
    const page = base.page;
    console.log('------> 0000');

    await page.goto('https://3x.ant.design/components/tree-select-cn/')

    // 节点内容:Node1
    await base.click('section:nth-child(2) > section > .ant-select > .ant-select-selection > ul')

    // 父级内容:Node2
    await base.click('.ant-select-tree > li:nth-child(2) > .ant-select-tree-switcher > .anticon > svg')

    // 父级内容:Child Node3
    await base.click('li > .ant-select-tree-child-tree > li:nth-child(1) > .ant-select-tree-checkbox > .ant-select-tree-checkbox-inner')

    // 节点内容:API#
    await base.click('.ant-col > section h2:nth-child(1)')

};
