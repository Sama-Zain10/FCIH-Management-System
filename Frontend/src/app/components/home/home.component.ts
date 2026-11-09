import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent {
    title = 'Academic Curator Dashboard';

    stats = [
        { title: 'Cumulative GPA', value: '3.92', subtitle: 'Current standing', icon: '📊' },
        { title: 'Credits Earned', value: '104', subtitle: '/ 120 required', icon: '🎓' },
        { title: 'Active Courses', value: '6', subtitle: 'This semester', icon: '📚' },
        { title: 'Weekly Hours', value: '24', subtitle: 'Lecture & Lab', icon: '⏱️', featured: true }
    ];

    progressPercent = 87;

    upcomingClasses = [
        {
            time: '09:00',
            title: 'Advanced Algorithmic Design',
            location: 'Hall 48',
            instructor: 'Dr. Elena Sterling',
            day: 'Monday'
        },
        {
            time: '11:00',
            title: 'Neural Networks & Deep Learning',
            location: 'Lab 12',
            instructor: 'Prof. Marcus Chen',
            day: 'Monday'
        },
        {
            time: '14:00',
            title: 'Art History: Renaissance',
            location: 'Hall 23',
            instructor: 'Prof. Sarah Williams',
            day: 'Wednesday'
        }
    ];
}
