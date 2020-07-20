import { Base } from "./Base";

export interface Flow {
    (page: Base): Promise<void>;
}

