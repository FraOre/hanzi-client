interface CharacterInterface {
    id: number;
    hanzi: string;
    pinyin: string;
    untoned: string;
    hasAudio: boolean;
    translation: string;
    lesson: Lesson;
    category: Category;
};

export { CharacterInterface };