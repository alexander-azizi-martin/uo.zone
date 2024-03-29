import urlJoin from 'url-join';

import { getRandomServerUrl } from '~/lib/helpers';

import {
  type Course,
  type CourseWithProfessors,
  type ProfessorWithCourses,
  type SearchResults,
  type SubjectWithCourses,
} from './api-types';

export const API_URL =
  typeof window === 'undefined' ? urlJoin(getRandomServerUrl(), 'api') : '/api';

async function fetchData<T>(url: string, options: RequestInit = {}) {
  const res = await fetch(url, options);

  if (!res.ok) {
    throw res;
  }

  return (await res.json()) as T;
}

export async function search(query: string, lang: string = 'en') {
  const url = urlJoin(API_URL, 'search');
  return await fetchData<SearchResults>(url, {
    method: 'post',
    headers: {
      'Accept-Language': lang,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ q: query }),
  });
}

export async function getCourse(code: string, lang: string = 'en') {
  const url = urlJoin(API_URL, 'courses', code);
  return await fetchData<CourseWithProfessors>(url, {
    headers: { 'Accept-Language': lang },
  });
}

export async function getProfessor(id: string, lang: string = 'en') {
  const url = urlJoin(API_URL, 'professors', id);
  return await fetchData<ProfessorWithCourses>(url, {
    headers: { 'Accept-Language': lang },
  });
}

export async function getSubject(code: string, lang: string = 'en') {
  const url = urlJoin(API_URL, 'subjects', code.toLowerCase());
  return await fetchData<SubjectWithCourses>(url, {
    headers: { 'Accept-Language': lang },
  });
}

export async function getSubjectCourses(code: string, lang: string = 'en') {
  const url = urlJoin(API_URL, 'subjects', code.toLowerCase(), 'courses');
  return await fetchData<Course[]>(url, {
    headers: { 'Accept-Language': lang },
  });
}
