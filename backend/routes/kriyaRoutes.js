import express from 'express';
import { protect, admin, optionalAuth } from '../middleware/auth.js';
import { uploadKriyaCategoryImage, uploadKriyaElementImage, uploadKriyaPreview } from '../middleware/upload.js';
import asyncHandler from '../utils/asyncHandler.js';
import {
  getCategories, getAllCategoriesAdmin, createCategory, updateCategory, deleteCategory,
  getElements, getAllElementsAdmin, createElement, updateElement, deleteElement,
  createDesign, getMyDesigns, getAllDesignsAdmin, updateDesign,
} from '../controllers/kriyaController.js';

const router = express.Router();

// ---------- Categories ----------
router.get('/categories', asyncHandler(getCategories));
router.get('/categories/admin/all', protect, admin, asyncHandler(getAllCategoriesAdmin));
router.post('/categories', protect, admin, uploadKriyaCategoryImage.single('coverImage'), asyncHandler(createCategory));
router.put('/categories/:id', protect, admin, uploadKriyaCategoryImage.single('coverImage'), asyncHandler(updateCategory));
router.delete('/categories/:id', protect, admin, asyncHandler(deleteCategory));

// ---------- Elements ----------
router.get('/elements', asyncHandler(getElements));
router.get('/elements/admin/all', protect, admin, asyncHandler(getAllElementsAdmin));
router.post('/elements', protect, admin, uploadKriyaElementImage.single('image'), asyncHandler(createElement));
router.put('/elements/:id', protect, admin, uploadKriyaElementImage.single('image'), asyncHandler(updateElement));
router.delete('/elements/:id', protect, admin, asyncHandler(deleteElement));

// ---------- Designs (finalize / quote workflow) ----------
router.post('/designs', optionalAuth, uploadKriyaPreview.single('preview'), asyncHandler(createDesign));
router.get('/designs/my', protect, asyncHandler(getMyDesigns));
router.get('/designs/admin/all', protect, admin, asyncHandler(getAllDesignsAdmin));
router.put('/designs/:id', protect, admin, asyncHandler(updateDesign));

export default router;
