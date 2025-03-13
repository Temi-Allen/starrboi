
import { Question } from './types';

export const competencyQuestions: Question[] = [
  {
    id: "1",
    category: "Leadership",
    text: "Describe a time when you had to lead a team through a difficult situation."
  },
  {
    id: "2",
    category: "Problem Solving",
    text: "Tell me about a complex problem you solved at work."
  },
  {
    id: "3",
    category: "Teamwork",
    text: "Give an example of when you worked effectively in a team."
  },
  {
    id: "4",
    category: "Communication",
    text: "Describe a situation where your communication skills made a difference."
  },
  {
    id: "5",
    category: "Adaptability",
    text: "Tell me about a time when you had to adapt to a significant change at work."
  },
  {
    id: "6",
    category: "Initiative",
    text: "Describe a situation where you showed initiative and took the lead."
  },
  {
    id: "7",
    category: "Decision Making",
    text: "Give an example of a difficult decision you had to make at work."
  },
  {
    id: "8",
    category: "Conflict Resolution",
    text: "Describe a time when you had to resolve a conflict between team members."
  },
  {
    id: "9",
    category: "Time Management",
    text: "Tell me about a time when you had to manage multiple projects simultaneously."
  },
  {
    id: "10",
    category: "Customer Service",
    text: "Give an example of when you provided exceptional customer service."
  }
];

export const mockSTARRAnswer = {
  situation: "During my time at XYZ Company, we faced a critical deadline for a major client project that required coordination across multiple departments.",
  task: "As the project lead, I needed to ensure all teams were aligned and working efficiently to complete deliverables on time despite significant resource constraints.",
  action: "I implemented a daily stand-up meeting structure to increase visibility across teams, created a shared tracking document for real-time progress updates, and personally facilitated cross-team dependencies to remove blockers quickly.",
  result: "We successfully delivered the project two days ahead of schedule, exceeding the client's expectations. The client subsequently increased their contract value by 15% and provided an excellent testimonial that helped secure two new clients.",
  reflection: "This experience taught me the importance of proactive communication and transparent tracking systems in project management. In future projects, I would implement these strategies even earlier to prevent potential bottlenecks before they arise."
};
