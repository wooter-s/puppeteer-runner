import { table } from "./flow/standard/table/table";
// import { dbClickWithHover } from "./flow/test/dbclick-antd";
import { Base, IsRecord, RecordManger } from "..";
import { dbClickWithHover } from "./flow/test/dbclick-antd";
import { TestNode } from "./flow/withTextTestNode";
import { TreeSelectNode } from "./flow/test/treeSelect";

class Test extends Base {
    constructor() {
        super();
    }

    private isRecord: IsRecord = (response) => {
        return false
    }

    private addEventListener() {
        const recordManger = new RecordManger(this.page, this.isRecord);
        this.page.on("response", recordManger.handleResponse)
    }

    start = async () => {
        // await this.page.goto('https://ant.design/components/dropdown-cn/', { waitUntil: 'networkidle2'});
        // this.addEventListener();
        // console.log('------> 1', 1);
        // // await table(this);
        // await dbClickWithHover(this);
        // await this.closeBrowser()
        await this.nodeRunners(
            [
                // TestNode,
                TreeSelectNode
            ]
        )
        // await this.closeBrowser()

    }
}

const testRunner = new Test();
testRunner.run(testRunner.start)
