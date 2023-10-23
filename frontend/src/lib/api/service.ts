import urlJoin from 'url-join';
import { notFound } from 'next/navigation';
import type {
  SearchResults,
  CourseWithProfessors,
  ProfessorWithCourses,
  SubjectWithCourses,
} from './types';

export const API_URL = '/api';

async function fetchData<T>(url: string, lang: string = 'en') {
  try {
    const res = await fetch(url, { headers: { 'Accept-Language': lang } });
    return (await res.json()) as T;
  } catch (error) {
    notFound();
  }
}

export async function search(query: string, lang: string = 'en') {
  const url = urlJoin(API_URL, 'search', `?q=${query}`);
  return await fetchData<SearchResults>(url, lang);
}

export async function getCourse(code: string, lang: string = 'en') {
  const url = urlJoin(API_URL, 'courses', code);
  return await fetchData<CourseWithProfessors>(url, lang);
}

export async function getProfessor(id: string, lang: string = 'en') {
  const url = urlJoin(API_URL, 'professors', id);
  return await fetchData<ProfessorWithCourses>(url, lang);
}

export async function getSubject(code: string, lang: string = 'en') {
  const url = urlJoin(API_URL, 'subjects', code);
  return await fetchData<SubjectWithCourses>(url, lang);
}
