
export const querySelectorWithText = (query: string, text: string): Element | null => {
    let result: Element | null = null;
    const target = document.querySelectorAll(query);
    target.forEach((item) => {
        if (item.innerHTML !== text) {
            return;
        }
        result = item;
    });
    return result
};

