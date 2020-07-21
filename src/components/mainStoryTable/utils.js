import namor from "namor";

const range = len => {
    const arr = [];
    for (let i = 0; i < len; i++) {
        arr.push(i);
    }
    return arr;
};

const newPerson = () => {
    return {
        storyId: Math.floor(Math.random() * 30),
        storyName: namor.generate({ words: 1, numbers: 0 }),
        imageName: namor.generate({ words: 1, numbers: 0 }),
        questionCount: Math.floor(Math.random() * 100),
        select: false,
    };
};

export function makeData(len = 30) {
    return range(len).map(d => {
        return {
            ...newPerson(),
            children: range(10).map(newPerson)
        };
    });
}