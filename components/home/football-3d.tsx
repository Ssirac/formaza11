"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";

/**
 * Interactive 3D "match orb" — a faceted geodesic ball in gold-on-black.
 * Auto-rotates, leans toward the cursor, and glows with gold rim lighting.
 * Respects prefers-reduced-motion and pauses when scrolled off-screen.
 */
export function Football3D({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const geo = new THREE.IcosahedronGeometry(1.55, 1);
    const ball = new THREE.Mesh(
      geo,
      new THREE.MeshStandardMaterial({
        color: 0x0c0c0f,
        metalness: 0.6,
        roughness: 0.35,
        flatShading: true,
      })
    );
    group.add(ball);

    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geo),
      new THREE.LineBasicMaterial({
        color: 0xe3b23c,
        transparent: true,
        opacity: 0.7,
      })
    );
    group.add(edges);

    const halo = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.95, 1)),
      new THREE.LineBasicMaterial({
        color: 0xb8842a,
        transparent: true,
        opacity: 0.12,
      })
    );
    group.add(halo);

    scene.add(new THREE.AmbientLight(0x1b1b20, 1.2));
    const key = new THREE.PointLight(0xf6dc8f, 90, 30);
    key.position.set(4, 4, 5);
    scene.add(key);
    const fill = new THREE.PointLight(0xb8842a, 55, 30);
    fill.position.set(-5, -2, 3);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xfff2cf, 1.1);
    rim.position.set(-2, 3, -4);
    scene.add(rim);

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const target = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      const r = container.getBoundingClientRect();
      target.x = ((e.clientY - r.top) / r.height - 0.5) * 0.5;
      target.y = ((e.clientX - r.left) / r.width - 0.5) * 0.8;
    };
    container.addEventListener("pointermove", onMove);

    let rafId: number | null = null;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      group.rotation.y += 0.0035 + (target.y - group.rotation.y) * 0.0;
      group.rotation.x += (target.x - group.rotation.x) * 0.05;
      halo.rotation.y -= 0.001;
      renderer.render(scene, camera);
    };

    let visible = true;
    const start = () => {
      if (reduceMotion || rafId !== null) return;
      animate();
    };
    const stop = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { threshold: 0 }
    );
    io.observe(container);
    if (!reduceMotion && visible) start();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      container.removeEventListener("pointermove", onMove);
      geo.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={cn("h-full w-full cursor-grab active:cursor-grabbing", className)}
    />
  );
}
