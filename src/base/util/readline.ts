import * as readline from 'readline';

export class Readline {
    static rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    static getInstance() {
        if (Readline.rl === undefined) {
            Readline.rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });
        }
        return Readline.rl
    }

    // 手动输入验证码
    static question =  async(query: string): Promise<string> => {
        return new Promise((resolve => {
            Readline.rl.question(query, async (answer) => {
                resolve(answer)
            })
        }))
    }
}
