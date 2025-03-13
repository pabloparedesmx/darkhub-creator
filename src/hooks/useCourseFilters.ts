
import { useState, useEffect } from 'react';
import { Course } from '@/components/ui/CourseCard';

export const useCourseFilters = (coursesData: Course[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [courses, setCourses] = useState<Course[]>(coursesData);
  const [filters, setFilters] = useState({
    all: true,
    courses: false,
    tutorials: false,
    free: false,
    pro: false
  });

  // Filter category options
  const [categories, setCategories] = useState({
    aiTools: false,
    writing: false,
    coding: false,
    dataAnalysis: false,
    contentCreation: false
  });

  // Difficulty options
  const [difficulties, setDifficulties] = useState({
    beginner: false,
    intermediate: false,
    advanced: false
  });

  useEffect(() => {
    // Apply filters
    let filteredCourses = [...coursesData];

    // Apply search term filter
    if (searchTerm) {
      filteredCourses = filteredCourses.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filters (free/pro/tutorial)
    if (!filters.all) {
      if (filters.tutorials) {
        filteredCourses = filteredCourses.filter(course => 
          course.badges.includes('tutorial')
        );
      }
      
      if (filters.free && !filters.pro) {
        filteredCourses = filteredCourses.filter(course => 
          course.badges.includes('free')
        );
      } else if (filters.pro && !filters.free) {
        filteredCourses = filteredCourses.filter(course => 
          course.badges.includes('pro')
        );
      }
    }

    // Apply sort order
    if (sortOrder === 'newest') {
      // For database-sourced courses, we can assume the ID reflects creation time or use created_at
      filteredCourses = [...filteredCourses].sort((a, b) => a.id > b.id ? -1 : 1);
    } else if (sortOrder === 'oldest') {
      filteredCourses = [...filteredCourses].sort((a, b) => a.id < b.id ? -1 : 1);
    } else if (sortOrder === 'az') {
      filteredCourses = [...filteredCourses].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOrder === 'za') {
      filteredCourses = [...filteredCourses].sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortOrder === 'popular') {
      // In a real app, we'd sort by popularity metrics like enrollment count
      // For now, we'll just use a simple alphabetical sort as a fallback
      filteredCourses = [...filteredCourses].sort((a, b) => a.title.localeCompare(b.title));
    }

    setCourses(filteredCourses);
  }, [searchTerm, filters, sortOrder, coursesData]);

  // Update courses when coursesData changes
  useEffect(() => {
    setCourses(coursesData);
  }, [coursesData]);

  const clearAllFilters = () => {
    setSearchTerm('');
    setFilters({
      all: true,
      courses: false,
      tutorials: false,
      free: false,
      pro: false
    });
    setCategories({
      aiTools: false,
      writing: false,
      coding: false,
      dataAnalysis: false,
      contentCreation: false
    });
    setDifficulties({
      beginner: false,
      intermediate: false,
      advanced: false
    });
    setSortOrder('newest');
  };

  return {
    searchTerm,
    setSearchTerm,
    courses,
    filters,
    setFilters,
    categories,
    setCategories,
    difficulties,
    setDifficulties,
    clearAllFilters,
    setSortOrder
  };
};
