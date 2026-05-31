import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

const PROJECTS = [
  {
    name: 'Residential Villa',
    icon: '🏠',
    items: ['3-Story Structure', 'Reinforced Concrete', 'Premium Finishes'],
    link: '#'
  },
  {
    name: 'Commercial Complex',
    icon: '🏢',
    items: ['Steel Framework', 'Glass Facade', 'Underground Parking'],
    link: '#'
  },
  {
    name: 'Industrial Warehouse',
    icon: '🏭',
    items: ['Pre-engineered Building', 'Heavy Duty Flooring', 'High Bays'],
    link: '#'
  },
  {
    name: 'Highway Bridge',
    icon: '🌉',
    items: ['Pre-stressed Girders', 'Deep Foundations', 'Asphalt Deck'],
    link: '#'
  }
];

export default function ProjectsSection() {
  return (
    <section id="projects">
      <div className="blueprint-bg" />
      <div className="section-header">
        <span className="section-badge">Our Portfolio</span>
        <h2 className="section-title">Featured Projects</h2>
        <p className="section-sub">Explore some of the recent civil engineering projects where our advanced estimation tools were utilized for precision and speed.</p>
      </div>
      <div className="project-grid">
        {PROJECTS.map((project, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.5, delay: idx * 0.1 }}>
            <div className="project-card h-full">
            <div className="project-card-header">
              <div className="project-icon">{project.icon}</div>
              <div className="project-name">{project.name}</div>
            </div>
            <ul className="project-items">
              {project.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <a href={project.link} className="project-link">
              Explore Details <ArrowRight size={14} />
            </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
