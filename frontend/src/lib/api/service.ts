import urlJoin from 'url-join';
import { notFound } from 'next/navigation';
import type {
  SearchResults,
  CourseWithProfessors,
  ProfessorWithCourses,
  Subject,
} from './types';

export const API_URL = urlJoin(
  process.env.NEXT_PUBLIC_SERVER_URL as string,
  'api'
);

async function fetchData<T>(url: string) {
  try {
    const res = await fetch(url);
    return (await res.json()) as T;
  } catch (error) {
    notFound();
  }
}

export async function search(query: string) {
  const url = urlJoin(API_URL, 'search', `?q=${query}`);
  return await fetchData<SearchResults>(url);
}

export async function getCourse(code: string) {
  const url = urlJoin(API_URL, 'courses', code);
  return await fetchData<CourseWithProfessors>(url);
}

export async function getProfessor(id: string) {
  const url = urlJoin(API_URL, 'professors', id);
  return await fetchData<ProfessorWithCourses>(url);
}

export async function getSubject(code: string) {
  const url = urlJoin(API_URL, 'subjects', code);
  return await fetchData<Subject>(url);
}
