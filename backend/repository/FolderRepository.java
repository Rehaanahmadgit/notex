package com.example.notepadx.repository;


import com.example.notepadx.model.Folder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FolderRepository extends JpaRepository<Folder, String> {
    List<Folder> findByParentId(String parentId);
}