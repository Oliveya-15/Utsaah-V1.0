import KriyaCategory from '../models/KriyaCategory.js';
import KriyaElement from '../models/KriyaElement.js';
import KriyaDesign from '../models/KriyaDesign.js';
import { notifyUser, notifyAdmin } from '../utils/notify.js';

/* ============================================================
   CATEGORIES (public read / admin write)
   ============================================================ */

// @desc Get active categories, for the customizer sidebar tabs
// @route GET /api/kriya/categories
export const getCategories = async (req, res) => {
  const categories = await KriyaCategory.find({ isActive: true }).sort({ displayOrder: 1, name: 1 });
  res.json(categories);
};

// @desc Get all categories including inactive ones (admin)
// @route GET /api/kriya/categories/admin/all
export const getAllCategoriesAdmin = async (req, res) => {
  const categories = await KriyaCategory.find().sort({ displayOrder: 1, name: 1 });
  res.json(categories);
};

// @desc Create a new category (admin) — this is how "Flower"/"Paper" and
//       any future group get added, no code changes required.
// @route POST /api/kriya/categories
export const createCategory = async (req, res) => {
  try {
    const { name, description, icon, displayOrder } = req.body;
    const coverImage = req.file ? req.file.path : '';
    const category = await KriyaCategory.create({ name, description, icon, displayOrder, coverImage });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update a category (admin)
// @route PUT /api/kriya/categories/:id
export const updateCategory = async (req, res) => {
  try {
    const category = await KriyaCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    const { name, description, icon, displayOrder, isActive } = req.body;
    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    if (icon !== undefined) category.icon = icon;
    if (displayOrder !== undefined) category.displayOrder = displayOrder;
    if (isActive !== undefined) category.isActive = isActive;
    if (req.file) category.coverImage = req.file.path;
    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete a category (admin) — blocked while elements still reference it
// @route DELETE /api/kriya/categories/:id
export const deleteCategory = async (req, res) => {
  const inUse = await KriyaElement.countDocuments({ category: req.params.id });
  if (inUse > 0) {
    return res.status(400).json({ message: `Cannot delete: ${inUse} element(s) use this category. Remove or move them first, or hide the category instead.` });
  }
  const category = await KriyaCategory.findByIdAndDelete(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.json({ message: 'Category removed' });
};

/* ============================================================
   ELEMENTS (public read / admin write)
   ============================================================ */

// @desc Get active elements for a given category, for the sidebar grid
// @route GET /api/kriya/elements?category=:categoryId
export const getElements = async (req, res) => {
  const filter = { isActive: true };
  if (req.query.category) filter.category = req.query.category;
  const elements = await KriyaElement.find(filter).sort({ displayOrder: 1, createdAt: -1 });
  res.json(elements);
};

// @desc Get all elements including inactive ones (admin), optionally by category
// @route GET /api/kriya/elements/admin/all
export const getAllElementsAdmin = async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  const elements = await KriyaElement.find(filter).populate('category', 'name slug').sort({ displayOrder: 1, createdAt: -1 });
  res.json(elements);
};

// @desc Upload a new element image into a category (admin)
// @route POST /api/kriya/elements
export const createElement = async (req, res) => {
  try {
    const { name, category, defaultSize, displayOrder } = req.body;
    if (!req.file) return res.status(400).json({ message: 'An image file is required' });
    const categoryExists = await KriyaCategory.findById(category);
    if (!categoryExists) return res.status(400).json({ message: 'Selected category does not exist' });

    const element = await KriyaElement.create({
      name: name || categoryExists.name,
      category,
      image: req.file.path,
      imagePublicId: req.file.filename || '',
      defaultSize: defaultSize || 140,
      displayOrder: displayOrder || 0,
    });
    res.status(201).json(element);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update an element — swap its image, rename, move category, etc. (admin)
// @route PUT /api/kriya/elements/:id
export const updateElement = async (req, res) => {
  try {
    const element = await KriyaElement.findById(req.params.id);
    if (!element) return res.status(404).json({ message: 'Element not found' });
    const { name, category, defaultSize, displayOrder, isActive } = req.body;
    if (name) element.name = name;
    if (category) element.category = category;
    if (defaultSize !== undefined) element.defaultSize = defaultSize;
    if (displayOrder !== undefined) element.displayOrder = displayOrder;
    if (isActive !== undefined) element.isActive = isActive;
    if (req.file) {
      element.image = req.file.path;
      element.imagePublicId = req.file.filename || '';
    }
    await element.save();
    res.json(element);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete an element (admin)
// @route DELETE /api/kriya/elements/:id
export const deleteElement = async (req, res) => {
  const element = await KriyaElement.findByIdAndDelete(req.params.id);
  if (!element) return res.status(404).json({ message: 'Element not found' });
  res.json({ message: 'Element removed' });
};

/* ============================================================
   DESIGNS (customer finalize / admin review — quote workflow)
   ============================================================ */

// @desc Submit a finalized canvas design (guest or logged in)
// @route POST /api/kriya/designs
export const createDesign = async (req, res) => {
  try {
    const { name, email, phone, title, notes, canvasSize, elements } = req.body;

    let parsedElements = [];
    let parsedCanvasSize = { width: 800, height: 800 };
    try {
      parsedElements = elements ? JSON.parse(elements) : [];
      parsedCanvasSize = canvasSize ? JSON.parse(canvasSize) : parsedCanvasSize;
    } catch {
      return res.status(400).json({ message: 'Design data is malformed — please try again' });
    }
    if (!Array.isArray(parsedElements) || parsedElements.length === 0) {
      return res.status(400).json({ message: 'Add at least one element to your design before finalizing' });
    }

    const previewImage = req.file ? req.file.path : '';

    const design = await KriyaDesign.create({
      user: req.user ? req.user._id : null,
      name,
      email,
      phone,
      title: title || 'My Kriya Design',
      canvasSize: parsedCanvasSize,
      elements: parsedElements,
      previewImage,
      notes,
    });

    if (req.user) {
      notifyUser({
        userId: req.user._id,
        title: 'Your Kriya design was received! 🌸',
        message: `Thanks ${name}! We've received your custom "${design.title}" design. Our team will reach out with a quote soon.`,
        type: 'general',
      });
    }
    notifyAdmin({
      title: `New Kriya design submitted — "${design.title}"`,
      message: `${name} (${phone}, ${email}) just finalized a Kriya design with ${parsedElements.length} element(s). Check the admin panel to review and send a quote.`,
    });

    res.status(201).json(design);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get my own submitted designs
// @route GET /api/kriya/designs/my
export const getMyDesigns = async (req, res) => {
  const designs = await KriyaDesign.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(designs);
};

// @desc Get all submitted designs (admin)
// @route GET /api/kriya/designs/admin/all
export const getAllDesignsAdmin = async (req, res) => {
  const designs = await KriyaDesign.find().sort({ createdAt: -1 });
  res.json(designs);
};

// @desc Update status / quote / reply on a design (admin)
// @route PUT /api/kriya/designs/:id
export const updateDesign = async (req, res) => {
  const design = await KriyaDesign.findById(req.params.id);
  if (!design) return res.status(404).json({ message: 'Design not found' });
  const { status, adminReply, quotedPrice } = req.body;
  if (status) design.status = status;
  if (adminReply !== undefined) design.adminReply = adminReply;
  if (quotedPrice !== undefined) design.quotedPrice = quotedPrice;
  await design.save();

  if (design.user) {
    notifyUser({
      userId: design.user,
      title: 'Update on your Kriya design',
      message: `Your design "${design.title}" is now: ${design.status}.${adminReply ? ' Note: ' + adminReply : ''}`,
      type: 'general',
    });
  }
  res.json(design);
};
