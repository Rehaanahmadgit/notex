package com.example.notepadx.repository;
import com.example.notepadx.model.File;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FileRepository extends JpaRepository<File, String> {
    List<File> findByParentId(String parentId);
    List<File> findByNameContainingIgnoreCase(String name);
}