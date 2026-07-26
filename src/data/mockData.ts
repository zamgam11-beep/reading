import { ReadingLog } from '../types';

export const INITIAL_MOCK_LOGS: ReadingLog[] = [
  {
    id: 'LOG_20260701_01',
    grade: 5,
    classNum: 2,
    studentName: '김민준',
    bookTitle: '마당을 나온 암탉',
    author: '황선미',
    publisher: '사계절',
    summary: '양계장을 탈출한 암탉 잎싹이가 초록머리 오리를 키우며 모성애와 자유의 가치를 깨닫는 이야기입니다. 끝까지 아기 오리를 보호하고 자신의 삶을 당당히 살아가는 암탉의 용기가 감동적이었습니다.',
    thoughts: '잎싹이가 보여준 용기와 사랑이 깊은 감동을 주었습니다. 소중한 것을 위해 희생하는 마음의 가치를 알게 되었습니다. 제 동생에게도 더 따뜻하게 대해주어야겠다고 생각했습니다.',
    rating: 5,
    createdAt: '2026-07-25 14:30',
    badge: '감성폭발 🎨',
    teacherComment: '잎싹이의 용기를 깊이 이해하고 가족 사랑으로 연결지은 느낀 점이 참 인상적입니다!'
  },
  {
    id: 'LOG_20260701_02',
    grade: 5,
    classNum: 2,
    studentName: '이서연',
    bookTitle: '아몬드',
    author: '손원평',
    publisher: '창비',
    summary: '감정을 느끼지 못하는 소년 윤재가 다양한 사람들을 만나며 타인의 감정을 이해하고 성장해가는 이야기입니다. 비극적인 사고 속에서도 조금씩 단단해지는 소년의 진솔한 모습을 담고 있습니다.',
    thoughts: '남들과 조금 다르더라도 서로를 이해하려고 노력하는 마음이 얼마나 중요한지 알게 되었습니다. 친구들의 마음을 더 깊이 헤아려주는 사람이 되고 싶습니다.',
    rating: 5,
    createdAt: '2026-07-24 16:15',
    badge: '생각으뜸 💡',
    teacherComment: '공감과 타인에 대한 이해에 대해 진지하게 고민해보았군요. 훌륭합니다.'
  },
  {
    id: 'LOG_20260701_03',
    grade: 5,
    classNum: 2,
    studentName: '김민준',
    bookTitle: '자전거 도둑',
    author: '박완서',
    publisher: '다림',
    summary: '시골에서 올라와 도시오락실 상점에서 일하는 수남이가 자전거 사건을 겪으며 도덕적 갈등을 겪고 양심을 지켜나가는 내용입니다.',
    thoughts: '어려운 상황에서도 양심을 지켜야 한다는 소중한 교훈을 배웠습니다. 물질적인 가치보다 도덕적인 정직함이 더 귀하다는 것을 깨달았습니다.',
    rating: 4,
    createdAt: '2026-07-23 10:20',
    badge: '다독왕 🏆'
  },
  {
    id: 'LOG_20260701_04',
    grade: 5,
    classNum: 1,
    studentName: '박지훈',
    bookTitle: '어린 왕자',
    author: '앙투안 드 생텍쥐페리',
    publisher: '열린책들',
    summary: '사막에 불시착한 조종사가 별에서 온 어린 왕자를 만나 길들임과 책임감, 진짜 중요한 것은 눈에 보이지 않는다는 진리를 깨닫는 여정입니다.',
    thoughts: '길들인다는 것은 서로에게 책임이 생긴다는 뜻이라는 말이 가장 기억에 남습니다. 소중한 친구들과의 관계를 다시 돌아보게 되었습니다.',
    rating: 5,
    createdAt: '2026-07-22 18:45',
    badge: '감성폭발 🎨'
  },
  {
    id: 'LOG_20260701_05',
    grade: 5,
    classNum: 2,
    studentName: '김민준',
    bookTitle: '해리 포터와 마법사의 돌',
    author: 'J.K. 롤링',
    publisher: '문학수첩',
    summary: '이모네 집에서 구박받던 해리가 호그와트 마법학교에 입학하여 친구들을 만나고 마법사의 돌을 지키기 위해 모험을 펼치는 이야기입니다.',
    thoughts: '용기와 우정으로 난관을 헤쳐나가는 해리와 친구들의 모습이 매우 흥미진진했습니다. 상상력이 샘솟는 즐거운 독서였습니다.',
    rating: 5,
    createdAt: '2026-07-21 11:10',
    badge: '다독왕 🏆'
  },
  {
    id: 'LOG_20260701_06',
    grade: 5,
    classNum: 2,
    studentName: '최유진',
    bookTitle: '지구 끝의 온실',
    author: '김초엽',
    publisher: '자이언트북스',
    summary: '더스트로 파괴된 세상에서 남겨진 사람들이 서로를 돕고 식물과 온실을 중심으로 생명을 이어나간 가슴 따뜻한 이야기입니다.',
    thoughts: '희망이 없는 절망적인 상황 속에서도 서로를 돌보는 사람들의 마음이 가슴에 깊게 다가왔습니다.',
    rating: 5,
    createdAt: '2026-07-20 15:00',
    badge: '꾸준함상 🌟'
  },
  {
    id: 'LOG_20260701_07',
    grade: 5,
    classNum: 2,
    studentName: '이서연',
    bookTitle: '몽실 언니',
    author: '권정생',
    publisher: '창비',
    summary: '한국전쟁이라는 비극적인 시대 상황 속에서도 어린 동생들을 보살피며 삶의 역경을 견뎌낸 몽실이의 가슴 아픈 고난 극복 이야기입니다.',
    thoughts: '평화의 소중함과 가족을 향한 몽실이의 따뜻한 사랑에 절로 숙연해졌습니다.',
    rating: 4,
    createdAt: '2026-07-19 13:20'
  },
  {
    id: 'LOG_20260701_08',
    grade: 6,
    classNum: 1,
    studentName: '정현우',
    bookTitle: '삼국지 1권',
    author: '나관중',
    publisher: '민음사',
    summary: '위, 촉, 오 세 나라의 영웅들이 천하를 다투며 지혜와 용기를 겨루는 역사 소설의 첫 시작입니다.',
    thoughts: '도원결의를 통해 평생의 우정을 맹세한 유비, 관우, 장비의 기상이 멋졌습니다.',
    rating: 5,
    createdAt: '2026-07-18 09:40'
  }
];

export const MOCK_PRAISE_STICKERS = [
  { id: 'badge1', label: '다독왕 🏆', description: '많은 책을 읽은 독서 열정파' },
  { id: 'badge2', label: '생각으뜸 💡', description: '깊이 있는 소감과 통찰력을 보여준 독서가' },
  { id: 'badge3', label: '감성폭발 🎨', description: '책의 감동을 생생하게 표현한 학생' },
  { id: 'badge4', label: '꾸준함상 🌟', description: '매일 꾸준히 책을 읽고 기록하는 학생' },
];
