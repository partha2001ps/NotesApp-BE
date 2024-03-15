const Notes = require("../model/notes");
const User = require("../model/user");

const NotesController = {
    addNotes: async (req, res) => {
        try {
            const userId = req.userId;
            const user = await User.findById(userId)
            if (!user) {
                return res.json({message:'user not authenticate'})
            }
            else {
                const { title, content,status } = req.body;
            const newNote = new Notes({
                userId: userId,
                title: title,
                user: userId,
                content: content,status
            });
            const savedNote = await newNote.save();
            return res.status(201).json(savedNote);
            }
        } catch (error) {
            console.error(error);
           return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    getNotes: async (req, res) => {
        try {
            const userId = req.userId;
            const user = await User.findById(userId)
            if (!user) {
                return res.json({message:'user not authenticate'})
            } else {
                
            const notes = await Notes.find({ user: userId });
           return res.status(200).json(notes);
            }
        } catch (error) {
            console.error(error);
           return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    editNotes: async (req, res) => {
        try {
            const userId = req.userId;
            const user = await User.findById(userId)
            if (!user) {
                return res.json({message:'user not authenticate'})
            }
            else {
                const { id, title, content,status } = req.body;
                const updatedNote = await Notes.findOneAndUpdate(
                    { _id: id, user: userId },
                    { title: title, content: content ,status:status},
                    { new: true }
                );
                if (!updatedNote) {
                    return res.status(404).json({ error: 'Note not found' });
                }
               return res.status(200).json({message:"Note Updat Done"});
           }
        } catch (error) {
            console.error(error);
           return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    deleteNotes: async (req, res) => {
        try {
            const userId = req.userId;
            const user = await User.findById(userId)
            if (!user) {
                return res.json({message:'user not authenticate'})
            }
            else {
                const id = req.params.id;
                const deletedNote = await Notes.findOneAndDelete({ _id: id });
                if (!deletedNote) {
                    return res.status(404).json({ error: 'Note not found' });
                }
                return res.status(200).json({ message:"Note Delete Done"});
           }
        } catch (error) {
            console.error(error);
           return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

module.exports = NotesController;
